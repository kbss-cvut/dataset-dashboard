package cz.cvut.kbss.datasetdashboard.service;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import cz.cvut.kbss.datasetdashboard.rest.dto.model.RawJson;
import cz.cvut.kbss.datasetdashboard.service.data.DataLoader;
import cz.cvut.kbss.datasetdashboard.util.Constants;
import cz.cvut.kbss.ddo.Vocabulary;
import cz.cvut.kbss.ddo.model.dataset_source;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.text.MessageFormat;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import org.apache.jena.query.Query;
import org.apache.jena.query.QueryFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;

@Service
public class DatasetSourceService {

    private final Map<Integer, dataset_source> datasetSources = new HashMap<>();

    @Autowired
    @Qualifier("remoteDataLoader")
    private DataLoader remoteLoader;

    @Autowired
    @Qualifier("localDataLoader")
    private DataLoader localLoader;

    public int register(final String url) {
        int id = url.hashCode();
        final dataset_source ds = new dataset_source();
        ds.setId(Vocabulary.s_c_dataset_source + "-" + id);
        ds.setProperties(Collections.singletonMap(Vocabulary.s_p_has_download_url, Collections.singleton(url)));
        ds.getTypes().add(Vocabulary.s_c_url_dataset_source);
        datasetSources.put(id, ds);
        return id;
    }

    public int register(final String endpointUrl, final String graphIri) {
        int id = (endpointUrl + graphIri).hashCode();
        final dataset_source ds = new dataset_source();
        ds.setId(Vocabulary.s_c_dataset_source + "-" + id);
        final Map<String, Set<String>> properties = new HashMap<>();
        properties.put(Vocabulary.s_p_has_endpoint_url, Collections.singleton(endpointUrl));
        final Set<String> types = new HashSet<>();
        types.add(Vocabulary.s_c_dataset_source);
        types.add(Vocabulary.s_c_url_dataset_source);
        if (graphIri != null) {
            properties.put(Vocabulary.s_p_has_graph_id, Collections.singleton(graphIri));
            types.add(Vocabulary.s_c_named_graph_sparql_endpoint_dataset_source);
        } else {
            types.add(Vocabulary.s_c_sparql_endpoint_dataset_source);
        }
        ds.setTypes(types);
        ds.setProperties(properties);
        datasetSources.put(id, ds);
        return id;
    }

    public RawJson getDataSources() {
        final JsonArray result = new JsonArray();
        datasetSources.forEach( (k,v) -> {
            final JsonObject ds = new JsonObject();
            ds.addProperty("hash",k);
            ds.addProperty("id",v.getId());
            if( v.getTypes().contains(Vocabulary.s_c_named_graph_sparql_endpoint_dataset_source)) {
                ds.addProperty("type",Vocabulary.s_c_named_graph_sparql_endpoint_dataset_source);
                ds.addProperty("endpointUrl",v.getProperties().get(Vocabulary.s_p_has_endpoint_url).iterator().next());
                ds.addProperty("graphId",v.getProperties().get(Vocabulary.s_p_has_graph_id).iterator().next());
            } else if( v.getTypes().contains(Vocabulary.s_c_sparql_endpoint_dataset_source)) {
                ds.addProperty("type",Vocabulary.s_c_sparql_endpoint_dataset_source);
                ds.addProperty("endpointUrl",v.getProperties().get(Vocabulary.s_p_has_endpoint_url).iterator().next());
            } else if( v.getTypes().contains(Vocabulary.s_c_url_dataset_source)) {
                ds.addProperty("type",Vocabulary.s_c_url_dataset_source);
                ds.addProperty("downloadUrl",v.getProperties().get(Vocabulary.s_p_has_download_url).iterator().next());
            } else {
                ds.addProperty("type",Vocabulary.s_c_dataset_source);
            }
            result.add(ds);
        });
        return new RawJson(result.toString());
    }

    /**
     * Executes given SPARQL Construct query against a dataset source. Efficiently, a new dataset snapshot
     * is created and queried by the user supplied query
     *
     * @param queryFile of the SPARQL query to execute
     * @return a {@link RawJson} object containing JSONLD-formatted result.
     *
     * @throws IllegalArgumentException When the specified queryName is not known
     */
    public RawJson getSparqlConstructResult(final String queryFile, final int datasetSourceId) {
        if (!datasetSources.containsKey(datasetSourceId)) {
            throw new IllegalStateException("Unable to find dataset source with id " +
                datasetSourceId);
        }
        final dataset_source datasetSource = datasetSources.get(datasetSourceId);
        if (datasetSource.getTypes().contains(
            Vocabulary.s_c_named_graph_sparql_endpoint_dataset_source)) {
            final String endpointURL = datasetSource.getProperties()
                .get(Vocabulary.s_p_has_endpoint_url).iterator().next();
            final String graphIRI = datasetSource.getProperties()
                .get(Vocabulary.s_p_has_graph_id).iterator().next();
            return getSparqlResult(queryFile, endpointURL,
                graphIRI, "application/ld+json");
        } else if (datasetSource.getTypes()
            .contains(Vocabulary.s_c_sparql_endpoint_dataset_source)) {
            final String endpointURL = datasetSource.getProperties()
                .get(Vocabulary.s_p_has_endpoint_url).iterator().next();
            return getSparqlResult(queryFile, endpointURL,
                null, "application/ld+json");
        } else {
            throw new IllegalStateException(MessageFormat.format(
                "The dataset source of types {} is not recognized.",
                datasetSource.getTypes()));
        }
    }

    /**
     * Executes given named SPARQL query
     *
     * @param queryFile of the SPARQL query
     * @return a {@link RawJson} object containing JSON-formatted SPARQL Select result.
     *
     * @throws IllegalArgumentException When the specified queryName is not known
     */
    private RawJson getSparqlResult(final String queryFile,
                                    final String repositoryUrl,
                                    final String graphIRI,
                                    final String mediaType) {
        if (repositoryUrl.isEmpty()) {
            throw new IllegalStateException("Missing repository URL configuration.");
        }
        String query = localLoader.loadData(queryFile, Collections.emptyMap());
        try {
            if (graphIRI != null) {
                final Query q = QueryFactory.create(query);
                q.addGraphURI(graphIRI);
                query = q.toString();
            }
            query = URLEncoder.encode(query, Constants.UTF_8_ENCODING);
            final Map<String, String> params = new HashMap<>();
            params.put("query", query);
            params.put(HttpHeaders.ACCEPT, mediaType);
            final String data = remoteLoader.loadData(repositoryUrl, params);
            return new RawJson(data);
        } catch (UnsupportedEncodingException e) {
            throw new IllegalStateException("Unable to find encoding "
                + Constants.UTF_8_ENCODING, e);
        }
    }
}

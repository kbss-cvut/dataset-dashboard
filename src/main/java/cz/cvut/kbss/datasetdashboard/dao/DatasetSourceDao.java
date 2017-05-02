package cz.cvut.kbss.datasetdashboard.dao;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
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
import javax.annotation.PostConstruct;
import org.apache.jena.query.Query;
import org.apache.jena.query.QueryFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Repository;

@Repository
public class DatasetSourceDao {

    private Logger logger = LoggerFactory.getLogger(DatasetSourceDao.class);
    private static final String JSON_LD = "application/ld+json";

    @Autowired
    @Qualifier("remoteDataLoader")
    private DataLoader remoteLoader;

    @Autowired
    @Qualifier("localDataLoader")
    private DataLoader localLoader;

    private final Map<Integer, dataset_source> datasetSources = new HashMap<>();

    private final Set<Integer> rootDatasetSources = new HashSet<>();

    @PostConstruct
    public void init() {
        // loadCkanDatasetSources("http://147.32.84.102:7200/repositories/eu_opendatamonitor_jopa");
        // loadCkanDatasetSources("http://147.32.84.102:7200/repositories/cz_opendata_jopa");
    }

    private String getStringValue(final JsonObject o, final String parameter) {
        return o.get(parameter).getAsJsonObject().get("value").getAsString();
    }

    private JsonArray getSparqlSelectResult(final String queryName,
                                            final String sparqlEndpointUrl) {
        final JsonParser jsonParser = new JsonParser();
        final String result = getSparqlResult(queryName,
            sparqlEndpointUrl, null, "application/json");
        final JsonElement jsonResult = jsonParser.parse(result);
        return jsonResult.getAsJsonObject()
            .get("results").getAsJsonObject()
            .get("bindings").getAsJsonArray();
    }

    private void loadCkanDatasetSources(final String sparqlEndpointUrl) {
        try {
            getSparqlSelectResult("query/get_ckan_datasetsources.rq", sparqlEndpointUrl)
                .forEach((e) -> {
                    final String type = getStringValue(e.getAsJsonObject(), "type");
                    final String url = getStringValue(e.getAsJsonObject(), "url");

                    if (Vocabulary.s_c_sparql_endpoint_dataset_source.equals(type)) {
                        final int id = register(url, null);
                        loadAllNamedGraphsFromEndpoint(url);
                    } else if (Vocabulary.s_c_url_dataset_source.equals(type)) {
                        register(url, null);
                    }
                });
        } catch (final Exception e) {
            logger.info("Unable to fetch dataset sources from {}", sparqlEndpointUrl, e);
        }
    }

    private void loadAllNamedGraphsFromEndpoint(final String sparqlEndpointUrl) {
        getSparqlSelectResult("query/get_sparql_endpoint_named_graph_datasetsources.rq",
            sparqlEndpointUrl).forEach((e) -> {
                final String graph = getStringValue(e.getAsJsonObject(), "graph");
                register(sparqlEndpointUrl, graph);
            }
        );
    }

    /**
     * Executes given named SPARQL query
     *
     * @param queryFile of the SPARQL query
     * @return a {@link String} object containing JSON-formatted SPARQL Select result.
     *
     * @throws IllegalArgumentException When the specified queryName is not known
     */
    public String getSparqlResult(final String queryFile,
                                  final String repositoryUrl,
                                  final String graphIri,
                                  final String mediaType) {
        if (repositoryUrl.isEmpty()) {
            throw new IllegalStateException("Missing repository URL configuration.");
        }
        String query = localLoader.loadData(queryFile, Collections.emptyMap());
        try {
            if (graphIri != null) {
                final Query q = QueryFactory.create(query);
                q.addGraphURI(graphIri);
                query = q.toString();
            }
            query = URLEncoder.encode(query, Constants.UTF_8_ENCODING);
            final Map<String, String> params = new HashMap<>();
            params.put("query", query);
            if (mediaType != null) {
                params.put(HttpHeaders.ACCEPT, mediaType);
            }
            return remoteLoader.loadData(repositoryUrl, params);
        } catch (UnsupportedEncodingException e) {
            throw new IllegalStateException("Unable to find encoding "
                + Constants.UTF_8_ENCODING, e);
        }
    }


    /**
     * Registers a dataset source defined by an URL.
     *
     * @param url to store as a dataset source
     * @return an identifier of the registered dataset source.
     */
    public int register(final String url) {
        int id = url.hashCode();
        final dataset_source ds = createDatasetSource(id);
        ds.getTypes().add(Vocabulary.s_c_url_dataset_source);
        ds.getProperties().put(Vocabulary.s_p_has_download_url, Collections.singleton(url));
        datasetSources.put(id, ds);
        rootDatasetSources.add(id);
        return id;
    }

    /**
     * Registers a dataset source by an endpoint URL and a graph IRI.
     *
     * @param endpointUrl URL of the SPARQL endpoint
     * @param graphIri    IRI of the context within the SPARQL endpoint
     * @return an identifier of the registered dataset source
     */
    public int register(final String endpointUrl, final String graphIri) {
        int id = (endpointUrl + graphIri).hashCode();
        if (datasetSources.containsKey(id)) {
            return id;
        }

        final dataset_source ds = createDatasetSource(id);
        datasetSources.put(id, ds);
        ds.getProperties().put(Vocabulary.s_p_has_endpoint_url, Collections.singleton(endpointUrl));
        ds.getTypes().add(Vocabulary.s_c_url_dataset_source);
        if (graphIri != null) {
            ds.getProperties().put(Vocabulary.s_p_has_graph_id, Collections.singleton(graphIri));
            ds.getTypes().add(Vocabulary.s_c_named_graph_sparql_endpoint_dataset_source);

            int idEndpoint = register(endpointUrl, null);
            // ds.getProperties().put(Vocabulary.s_p_has_, Collections.singleton(graphIri));
        } else {
            ds.getTypes().add(Vocabulary.s_c_sparql_endpoint_dataset_source);
            rootDatasetSources.add(id);
        }
        return id;
    }

    private dataset_source createDatasetSource(int id) {
        final dataset_source datasetSource = new dataset_source();
        datasetSource.setId(Vocabulary.s_c_dataset_source + "-" + id);
        final Set<String> types = new HashSet<>();
        types.add(Vocabulary.s_c_dataset_source);
        datasetSource.setTypes(types);
        final Map<String, Set<String>> properties = new HashMap<>();
        datasetSource.setProperties(properties);
        return datasetSource;
    }

    /**
     * Returns all registered data sources.
     *
     * @return a list of data sources.
     */
    public Map<Integer, dataset_source> getDataSources() {
        return datasetSources;
    }

    /**
     * Executes given SPARQL Construct query against a dataset source. Efficiently, a new dataset
     * snapshot is created and queried by the user supplied query
     *
     * @param queryFile of the SPARQL query to execute
     * @return a {@link String} object containing JSONLD-formatted result.
     *
     * @throws IllegalArgumentException When the specified queryName is not known
     */
    public String getSparqlConstructResult(final String queryFile, final int datasetSourceId) {
        if (!datasetSources.containsKey(datasetSourceId)) {
            throw new IllegalStateException("Unable to find dataset source with id "
                + datasetSourceId);
        }
        try {
            final dataset_source datasetSource = datasetSources.get(datasetSourceId);
            if (datasetSource.getTypes().contains(
                Vocabulary.s_c_named_graph_sparql_endpoint_dataset_source)) {
                final String endpointUrl = datasetSource.getProperties()
                    .get(Vocabulary.s_p_has_endpoint_url).iterator().next();
                final String graphIri = datasetSource.getProperties()
                    .get(Vocabulary.s_p_has_graph_id).iterator().next();
                return getSparqlResult(queryFile, endpointUrl,
                    graphIri, "text/turtle");
            } else if (datasetSource.getTypes()
                .contains(Vocabulary.s_c_sparql_endpoint_dataset_source)) {
                final String endpointUrl = datasetSource.getProperties()
                    .get(Vocabulary.s_p_has_endpoint_url).iterator().next();
                return getSparqlResult(queryFile, endpointUrl,
                    null, "text/turtle");
            } else {
                throw new IllegalStateException(MessageFormat.format(
                    "The dataset source of types {} is not recognized.",
                    datasetSource.getTypes()));
            }
        } catch (Exception e) {
            logger.error("Fetching data failed for queryFile {} and datasetSourceId {}",
                queryFile, datasetSourceId, e);
            return null;
        }
    }

    /**
     * Retrieves the last descriptor of given type for the given dataset source id.
     * @param datasetSourceId id of the dataset source
     * @param descriptorType IRI of the class of the descriptor
     * @return content of the descriptor
     */
    public String getLastDescriptor(final int datasetSourceId, final String descriptorType) {
        if (!datasetSources.containsKey(datasetSourceId)) {
            throw new IllegalStateException("Unable to find dataset source with id "
                + datasetSourceId);
        }

        final dataset_source datasetSource = datasetSources.get(datasetSourceId);

        if ((Vocabulary.ONTOLOGY_IRI_dataset_descriptor + "/s-p-o-summary-descriptor")
            .equals(descriptorType)) {
            if (datasetSource.getTypes().contains(
                Vocabulary.s_c_named_graph_sparql_endpoint_dataset_source)) {

                final String graphIri = datasetSource.getProperties()
                    .get(Vocabulary.s_p_has_graph_id).iterator().next();
                return getSparqlResult(
                    "/query/spo/spo-summary.rq", // the query to select precalculated spo
                    "http://onto.fel.cvut.cz/rdf4j-server/repositories/linked.opendata.cz-s-p-o-summary-descriptor", // the endpoint where the precalculated spos are located
                    graphIri,
                    JSON_LD);
            } else if (datasetSource.getTypes()
                .contains(Vocabulary.s_c_sparql_endpoint_dataset_source)) {
                return null;
            } else {
                throw new IllegalStateException(MessageFormat.format(
                    "The dataset source of types {} is not recognized.",
                    datasetSource.getTypes()));
            }
        } else {
            return null;
        }
    }
}

package cz.cvut.kbss.datasetdashboard.service;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import cz.cvut.kbss.datasetdashboard.dao.DatasetSourceDao;
import cz.cvut.kbss.datasetdashboard.model.util.EntityToOwlClassMapper;
import cz.cvut.kbss.datasetdashboard.rest.dto.model.RawJson;
import cz.cvut.kbss.ddo.Vocabulary;
import java.io.StringReader;
import java.io.StringWriter;
import java.util.Map;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.riot.RDFDataMgr;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DatasetSourceService {

    @Autowired
    private DatasetSourceDao datasetSourceDao;

    /**
     * Registers a dataset source defined by an URL.
     *
     * @param url to store as a dataset source
     * @return an identifier of the registered dataset source.
     */
    public int register(final String url) {
        return datasetSourceDao.register(url);
    }

    /**
     * Registers a dataset source by an endpoint URL and a graph IRI.
     *
     * @param endpointUrl URL of the SPARQL endpoint
     * @param graphIri    IRI of the context within the SPARQL endpoint
     * @return an identifier of the registered dataset source
     */
    public int register(final String endpointUrl, final String graphIri) {
        return datasetSourceDao.register(endpointUrl, graphIri);
    }

    /**
     * Returns all registered data sources.
     *
     * @return a list of data sources.
     */
    public RawJson getDataSources() {
        final JsonArray result = new JsonArray();
        datasetSourceDao.getAll().forEach((v) -> {
            final JsonObject ds = new JsonObject();
            ds.addProperty("hash", v.getId()
                .substring(Vocabulary.s_c_dataset_source.length() + 1));
            ds.addProperty("id", v.getId());
            if (EntityToOwlClassMapper
                .isOfType(v, Vocabulary.s_c_named_graph_sparql_endpoint_dataset_source)) {
                ds.addProperty("type",
                    Vocabulary.s_c_named_graph_sparql_endpoint_dataset_source);
                ds.addProperty("endpointUrl",
                    v.getProperties().get(Vocabulary.s_p_has_endpoint_url)
                        .iterator().next().toString());
                ds.addProperty("graphId",
                    v.getProperties().get(Vocabulary.s_p_has_graph_id)
                        .iterator().next().toString());
            } else if (EntityToOwlClassMapper
                .isOfType(v, Vocabulary.s_c_sparql_endpoint_dataset_source)) {
                ds.addProperty("type", Vocabulary.s_c_sparql_endpoint_dataset_source);
                ds.addProperty("endpointUrl",
                    v.getProperties().get(Vocabulary.s_p_has_endpoint_url)
                        .iterator().next().toString());
            } else if (EntityToOwlClassMapper
                .isOfType(v, Vocabulary.s_c_url_dataset_source)) {
                ds.addProperty("type", Vocabulary.s_c_url_dataset_source);
                ds.addProperty("downloadUrl",
                    v.getProperties().get(Vocabulary.s_p_has_download_url)
                        .iterator().next().toString());
            } else {
                ds.addProperty("type", Vocabulary.s_c_dataset_source);
            }
            result.add(ds);
        });
        return new RawJson(result.toString());
    }

    /**
     * Executes given SPARQL Construct query against a dataset source. Efficiently, a new dataset
     * snapshot is created and queried by the user supplied query
     *
     * @param queryFile of the SPARQL query to execute
     * @return a {@link RawJson} object containing JSONLD-formatted result.
     *
     * @throws IllegalArgumentException When the specified queryName is not known
     */
    public RawJson getSparqlConstructResult(
        final String queryFile,
        final String datasetSourceId,
        final Map<String,String> bindings) {
        return new RawJson(toJsonLd(
            datasetSourceDao.getSparqlConstructResult(queryFile, datasetSourceId, bindings)));
    }

    private static String toJsonLd(String turtle) {
        Model m = ModelFactory.createDefaultModel();
        if (turtle != null) {
            m.read(new StringReader(turtle), null, "TURTLE");
        }
        final StringWriter w = new StringWriter();
        RDFDataMgr.write(w, m, org.apache.jena.riot.RDFLanguages.JSONLD);
        return w.toString();
    }

    public RawJson getLastDescriptor(final String datasetSourceId, final String descriptorType) {
        return new RawJson(toJsonLd(datasetSourceDao
            .getLastDescriptor(datasetSourceId, descriptorType)));
    }
}

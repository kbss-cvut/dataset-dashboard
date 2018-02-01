package cz.cvut.kbss.datasetdashboard.service;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import cz.cvut.kbss.datasetdashboard.dao.DatasetSourceDao;
import cz.cvut.kbss.datasetdashboard.model.util.EntityToOwlClassMapper;
import cz.cvut.kbss.datasetdashboard.rest.dto.model.RawJson;
import cz.cvut.kbss.datasetdashboard.util.JsonLd;
import cz.cvut.kbss.ddo.Vocabulary;
import cz.cvut.kbss.ddo.model.dataset_descriptor;
import cz.cvut.kbss.ddo.model.dataset_source;
import java.net.URI;
import java.text.MessageFormat;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service public class DatasetSourceService {

    @Autowired private DatasetSourceDao datasetSourceDao;

    /**
     * Registers a dataset source defined by an URL.
     *
     * @param url to store as a dataset source
     * @return an identifier of the registered dataset source.
     */
    @Transactional public String register(final String url) throws DatasetSourceServiceException {
        try {
            return datasetSourceDao.register(url).getId();
        } catch (Exception e) {
            throw new DatasetSourceServiceException(
                MessageFormat.format("Error in registering a URL dataset source {0}", url), e);
        }
    }

    /**
     * Registers a dataset source by an endpoint URL and a graph IRI.
     *
     * @param endpointUrl URL of the SPARQL endpoint
     * @param graphIri    IRI of the context within the SPARQL endpoint
     * @return an identifier of the registered dataset source, or an identifier of an existing
     * dataset source, if a dataset source with existing endpointURL and graph IRI exists.
     */
    @Transactional public String register(final String endpointUrl, final String graphIri)
        throws DatasetSourceServiceException {
        try {
            return datasetSourceDao.register(endpointUrl, graphIri).getId();
        } catch (Exception e) {
            throw new DatasetSourceServiceException(MessageFormat.format(
                "Error in registering a Named Graph Sparql Endpoint dataset source {0} : {1}",
                endpointUrl, graphIri), e);
        }
    }

    /**
     * Returns all registered data sources.
     *
     * @return a list of data sources.
     */
    @Transactional public RawJson getDataSources() throws DatasetSourceServiceException {
        try {
            return new RawJson(outputSources(datasetSourceDao.getAll()).toString());
        } catch (Exception e) {
            throw new DatasetSourceServiceException(
                "Error in registering a Named Graph Sparql Endpoint dataset source", e);
        }
    }

    /**
     * Returns all registered data sources.
     *
     * @return a list of data sources.
     */
    private JsonArray outputSources(final List<dataset_source> datasetSources) {
        final JsonArray result = new JsonArray();
        datasetSources.forEach((v) -> {
            try {
                final JsonObject ds = new JsonObject();
                ds.addProperty("id", v.getId());
                if (EntityToOwlClassMapper
                    .isOfType(v, Vocabulary.s_c_named_graph_sparql_endpoint_dataset_source)) {
                    ds.addProperty("type",
                        Vocabulary.s_c_named_graph_sparql_endpoint_dataset_source);
                    ds.addProperty("endpointUrl",
                        v.getProperties().get(Vocabulary.s_p_has_endpoint_url).iterator().next()
                         .toString());
                    ds.addProperty("graphId",
                        v.getProperties().get(Vocabulary.s_p_has_graph_id).iterator().next()
                         .toString());
                } else if (EntityToOwlClassMapper
                    .isOfType(v, Vocabulary.s_c_sparql_endpoint_dataset_source)) {
                    ds.addProperty("type", Vocabulary.s_c_sparql_endpoint_dataset_source);
                    ds.addProperty("endpointUrl",
                        v.getProperties().get(Vocabulary.s_p_has_endpoint_url).iterator().next()
                         .toString());
                } else if (EntityToOwlClassMapper.isOfType(v, Vocabulary.s_c_url_dataset_source)) {
                    ds.addProperty("type", Vocabulary.s_c_url_dataset_source);
                    ds.addProperty("downloadUrl",
                        v.getProperties().get(Vocabulary.s_p_has_download_url).iterator().next()
                         .toString());
                } else {
                    ds.addProperty("type", Vocabulary.s_c_dataset_source);
                }
                result.add(ds);
            } catch (Exception e) {
                e.printStackTrace();
                System.out.println("Invalid source " + v.getId() + " , skipping");
            }
        });
        return result;
    }

    @Transactional public RawJson getDescriptorsForDatasetSource(final String sourceId,
                                                                 final String descriptorTypeIri)
        throws DatasetSourceServiceException {
        try {
            return new RawJson(
                outputDescriptors(datasetSourceDao.getDescriptors(sourceId, descriptorTypeIri))
                    .toString());
        } catch (Exception e) {
            throw new DatasetSourceServiceException(MessageFormat
                .format("Error in getting descriptors of type {0} for a dataset source {1}",
                    descriptorTypeIri, sourceId), e);
        }
    }

    private JsonArray outputDescriptors(List<dataset_descriptor> data) {
        final JsonArray result = new JsonArray();
        data.forEach((v) -> {
            try {
                final JsonObject ds = new JsonObject();
                ds.addProperty("id", v.getId());
                ds.addProperty("type", Vocabulary.s_c_dataset_descriptor);
                result.add(ds);
            } catch (Exception e) {
                System.out.println("Invalid source " + v.getId() + " , skipping");
            }
        });
        return result;
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
    @Transactional public RawJson getSparqlConstructResult(final String queryFile, final String id,
                                                           final Map<String, String> bindings)
        throws DatasetSourceServiceException {
        try {
            return new RawJson(JsonLd.toJsonLd(datasetSourceDao
                .getSparqlConstructResult(datasetSourceDao.find(URI.create(id)), queryFile,
                    bindings)));
        } catch (Exception e) {
            throw new DatasetSourceServiceException(MessageFormat
                .format("Error in executing query {0} with bindings {1} for a dataset source {2}",
                    queryFile, bindings, id), e);
        }
    }
}

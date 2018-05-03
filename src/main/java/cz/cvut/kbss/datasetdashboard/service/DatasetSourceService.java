package cz.cvut.kbss.datasetdashboard.service;

import cz.cvut.kbss.datasetdashboard.dao.DatasetSourceDao;
import cz.cvut.kbss.datasetdashboard.rest.dto.model.RawJson;
import cz.cvut.kbss.datasetdashboard.util.JsonLd;
import cz.cvut.kbss.datasetdashboard.util.ServiceUtils;
import cz.cvut.kbss.ddo.model.dataset_descriptor;
import java.net.URI;
import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service public class DatasetSourceService {

    private static final Logger LOG = LoggerFactory.getLogger(DatasetSourceService.class);

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
            LOG.error("Unknown error while registering dataset.",e);
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
            LOG.error("Unknown error while registering dataset.",e);
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
            return new RawJson(ServiceUtils.outputSources(datasetSourceDao.getAll()).toString());
        } catch (Exception e) {
            LOG.error("Unknown error while getting dataset sources.",e);
            throw new DatasetSourceServiceException(
                "Error in registering a Named Graph Sparql Endpoint dataset source", e);
        }
    }

    @Transactional public RawJson getDescriptorsForDatasetSource(final String sourceId,
                                                                 final String descriptorTypeIrisCommaSeparated)
        throws DatasetSourceServiceException {
        try {
            final List<dataset_descriptor> descriptors = new ArrayList<>();
            Arrays.stream(descriptorTypeIrisCommaSeparated.split(","))
                  .forEach(dt -> descriptors.addAll(datasetSourceDao.getDescriptors(sourceId, dt)));
            return new RawJson(ServiceUtils.outputDescriptors(descriptors).toString()
            );
        } catch (Exception e) {
            LOG.error("Unknown error",e);
            throw new DatasetSourceServiceException(MessageFormat
                .format("Error in getting descriptors of type {0} for a dataset source {1}",
                    descriptorTypeIrisCommaSeparated, sourceId), e);
        }
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
            LOG.error("Unknown error",e);
            throw new DatasetSourceServiceException(MessageFormat
                .format("Error in executing query {0} with bindings {1} for a dataset source {2}",
                    queryFile, bindings, id), e);
        }
    }
}

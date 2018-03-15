package cz.cvut.kbss.datasetdashboard;

import com.google.gson.JsonObject;
import cz.cvut.kbss.datasetdashboard.dao.DatasetSourceDao;
import cz.cvut.kbss.datasetdashboard.dao.SparqlAccessor;
import cz.cvut.kbss.ddo.Vocabulary;
import javax.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Repository;

@Repository
@PropertySource("classpath:config.properties")
public class CkanInitializer {

    private Logger logger = LoggerFactory.getLogger(CkanInitializer.class);

    @Autowired
    @Qualifier("localDataLoader")
    private DatasetSourceDao datasetSourceDao;

    @Autowired
    private SparqlAccessor sparqlAccessor;

    @Autowired
    private Environment env;

//    /**
//     * Loads predefined SPARQL endpoints from CKAN.
//     */
//    @PostConstruct
//    public void init() {
//        final String[] urls = env.getProperty("ckan.jackan.sparqlEndpoints").split(",");
//        for (final String ckanEndpoint : urls) {
//            if (!ckanEndpoint.isEmpty()) {
//                loadCkanDatasetSources(ckanEndpoint);
//            }
//        }
//    }
//
//    private String getStringValue(final JsonObject o, final String parameter) {
//        return o.get(parameter).getAsJsonObject().get("value").getAsString();
//    }
//
//    private void loadCkanDatasetSources(final String sparqlEndpointUrl) {
//        try {
//            sparqlAccessor.getSparqlSelectResult("query/get_ckan_datasetsources.rq",
//                sparqlEndpointUrl).forEach((e) -> {
//                    final String type = getStringValue(e.getAsJsonObject(), "type");
//                    final String url = getStringValue(e.getAsJsonObject(), "url");
//
//                    if (Vocabulary.s_c_sparql_endpoint_dataset_source.equals(type)) {
//                        datasetSourceDao.register(url, null);
//                        datasetSourceDao.getAllNamedGraphsInEndpoint(url).forEach((graphId) -> {
//                            datasetSourceDao.register(url, graphId);
//                        });
//                    } else if (Vocabulary.s_c_url_dataset_source.equals(type)) {
//                        datasetSourceDao.register(url, null);
//                    }
//                }
//            );
//        } catch (final Exception e) {
//            logger.info("Unable to fetch dataset sources from {}", sparqlEndpointUrl, e);
//        }
//    }
}

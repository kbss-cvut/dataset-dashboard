package cz.cvut.kbss.datasetdashboard.dao;

import cz.cvut.kbss.datasetdashboard.dao.data.DataLoader;
import cz.cvut.kbss.datasetdashboard.exception.WebServiceIntegrationException;
import cz.cvut.kbss.datasetdashboard.rest.dto.model.RawJson;
import cz.cvut.kbss.datasetdashboard.util.Constants;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import org.apache.jena.query.Query;
import org.apache.jena.query.QueryFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

//import org.springframework.http.MediaType;

@Repository
public class SparqlAccessor {

    private static final Logger LOG = LoggerFactory.getLogger(SparqlAccessor.class);

    @Autowired
    @Qualifier("remoteDataLoader")
    private DataLoader remoteLoader;

    @Autowired
    @Qualifier("localDataLoader")
    private DataLoader localLoader;

    /**
     * Executes given named SPARQL query
     *
     * @param queryFile of the SPARQL query
     * @return a {@link RawJson} object containing JSON-formatted SPARQL Select result.
     *
     * @throws IllegalArgumentException When the specified queryName is not known
     */
    private RawJson getSparqlResult(final String queryFile, final String repositoryUrl,
        final String mediaType) {
        if (repositoryUrl.isEmpty()) {
            throw new IllegalStateException("Missing repository URL configuration.");
        }
        String query = localLoader.loadData(queryFile, Collections.emptyMap());
        try {
            query = URLEncoder.encode(query, Constants.UTF_8_ENCODING);
            final Map<String, String> params = new HashMap<>();
            params.put("query", query);
            params.put(HttpHeaders.ACCEPT, mediaType);
            final String data = remoteLoader.loadData(repositoryUrl, params);
            return new RawJson(data);
        } catch (UnsupportedEncodingException e) {
            throw new IllegalStateException("Unable to find encoding " + Constants
                .UTF_8_ENCODING, e);
        }
    }

    /**
     * Executes given named SPARQL query
     *
     * @param queryFile of the SPARQL query
     * @return a {@link String} object containing JSON-formatted SPARQL Select result.
     *
     * @throws IllegalArgumentException When the specified queryName is not known
     */
    public String getSparqlResult(final String queryFile, final Map<String, String> bindings,
        final String repositoryUrl, final String graphIri, final String mediaType) {
        if (repositoryUrl.isEmpty()) {
            throw new IllegalStateException("Missing repository URL configuration.");
        }
        String query = localLoader.loadData(queryFile, Collections.emptyMap());
        try {
            //            if (!bindings.isEmpty()) {
            //                query = query + " VALUES (";
            //                for (final String key : bindings.keySet()) {
            //                    query = query + " ?" + key;
            //                }
            //                query = query + " )";
            //
            //                query = query + " { (";
            //                for (final String key : bindings.keySet()) {
            //                    query = query + " <" + bindings.get(key) + ">";
            //                }
            //                query = query + ") }";
            //            }

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
        } catch (WebServiceIntegrationException e) {
            LOG.warn("Error during query execution {} to endpoint {} and graphIri {}, exception "
                + "{}", queryFile, repositoryUrl, graphIri, e);
            return null;
        } catch (UnsupportedEncodingException e) {
            throw new IllegalStateException("Unable to find encoding " + Constants
                .UTF_8_ENCODING, e);
        }
    }
}
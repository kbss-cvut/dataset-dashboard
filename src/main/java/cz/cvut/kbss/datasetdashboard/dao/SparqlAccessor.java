package cz.cvut.kbss.datasetdashboard.dao;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import com.google.gson.JsonSyntaxException;
import cz.cvut.kbss.datasetdashboard.dao.data.DataLoader;
import cz.cvut.kbss.datasetdashboard.dao.util.SparqlUtils;
import cz.cvut.kbss.datasetdashboard.exception.WebServiceIntegrationException;
import cz.cvut.kbss.datasetdashboard.util.Constants;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import org.apache.jena.query.ParameterizedSparqlString;
import org.apache.jena.query.Query;
import org.apache.jena.query.QueryFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Repository;

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
     * Returns result of a SPARQL query.
     *
     * @param queryName         name of the query to executed
     * @param sparqlEndpointUrl URL of the SPARQL endpoint to execute the query on
     * @return a JSON array of results
     */
    public JsonArray getSparqlSelectResult(final String queryName, final String sparqlEndpointUrl) {
        final JsonParser jsonParser = new JsonParser();
        String result = getSparqlResult(queryName, Collections.emptyMap(), sparqlEndpointUrl, null,
                "application/json");
        if (result != null) {
            try {
                final JsonElement jsonResult = jsonParser.parse(result);
                return jsonResult.getAsJsonObject().get("results").getAsJsonObject().get("bindings")
                                 .getAsJsonArray();
            } catch(JsonSyntaxException e) {
                LOG.warn("Not a valid JSON ", e);
            }
        }
        return new JsonArray();
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
            ParameterizedSparqlString pss = new ParameterizedSparqlString(query);
            pss = SparqlUtils.setSingleBinding(pss, bindings);
            query = pss.toString();
            if (graphIri != null) {
                Query q = QueryFactory.create(query);
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

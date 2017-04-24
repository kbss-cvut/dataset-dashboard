package cz.cvut.kbss.datasetdashboard.service;

import cz.cvut.kbss.datasetdashboard.rest.dto.model.RawJson;
import cz.cvut.kbss.datasetdashboard.service.data.DataLoader;
import cz.cvut.kbss.datasetdashboard.util.Constants;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;

@Service
public class SparqlService {

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
    public RawJson getSparqlSelectResult(final String queryFile, final String repositoryUrl) {
        return getSparqlResult(queryFile, repositoryUrl, MediaType.APPLICATION_JSON_VALUE);
    }

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
            throw new IllegalStateException("Unable to find encoding "
                + Constants.UTF_8_ENCODING, e);
        }
    }
}

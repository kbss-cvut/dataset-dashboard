package cz.cvut.kbss.datasetdashboard.service.data;

import cz.cvut.kbss.datasetdashboard.exception.WebServiceIntegrationException;
import cz.cvut.kbss.datasetdashboard.util.Constants;
import java.net.URI;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.X509Certificate;
import java.util.HashMap;
import java.util.Map;
import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

@Service("remoteDataLoader")
public class RemoteDataLoader implements DataLoader {

    /**
     * Configurable HTTP headers supported by {@link #loadData(String, Map)}.
     */
    public static final String[] SUPPORTED_HEADERS = {HttpHeaders.ACCEPT, HttpHeaders.CONTENT_TYPE};
    private static final Logger LOG = LoggerFactory.getLogger(RemoteDataLoader.class);
    @Autowired
    private RestTemplate restTemplate;

    static {
        disableSslVerification();
    }

    private static void disableSslVerification() {
        try {
            // Create a trust manager that does not validate certificate chains
            TrustManager[] trustAllCerts = new TrustManager[] {new X509TrustManager() {
                public java.security.cert.X509Certificate[] getAcceptedIssuers() {
                    return null;
                }

                public void checkClientTrusted(X509Certificate[] certs, String authType) {
                }

                public void checkServerTrusted(X509Certificate[] certs, String authType) {
                }
            }
            };

            // Install the all-trusting trust manager
            SSLContext sc = SSLContext.getInstance("SSL");
            sc.init(null, trustAllCerts, new java.security.SecureRandom());
            HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());

            // Create all-trusting host name verifier
            HostnameVerifier allHostsValid = new HostnameVerifier() {
                public boolean verify(String hostname, SSLSession session) {
                    return true;
                }
            };

            // Install the all-trusting host verifier
            HttpsURLConnection.setDefaultHostnameVerifier(allHostsValid);
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        } catch (KeyManagementException e) {
            e.printStackTrace();
        }
    }

    /**
     * {@inheritDoc}
     * <p>The parameters are processed in the following way:</p>
     * <pre>
     * <ul>
     *     <li>Known and supported HTTP headers are extracted and,</li>
     *     <li>The rest of the parameters are used as query params in the request.</li>
     * </ul>
     * </pre>
     *
     * @param remoteUrl Remote data source (URL)
     * @param params    Query parameters
     * @return Loaded data
     */
    public String loadData(String remoteUrl, Map<String, String> params) {
        final HttpHeaders headers = processHeaders(params);
        final URI urlWithQuery = prepareUri(remoteUrl, params);
        final HttpEntity<Object> entity = new HttpEntity<>(null, headers);
        if (LOG.isTraceEnabled()) {
            LOG.trace("Getting remote data using {}", urlWithQuery.toString());
        }
        try {
            final ResponseEntity<String> result = restTemplate.exchange(urlWithQuery,
                HttpMethod.GET, entity, String.class);
            if (HttpStatus.MOVED_PERMANENTLY.equals(result.getStatusCode())
                || HttpStatus.FOUND.equals(result.getStatusCode())) {
                Map<String, String> params2 = new HashMap<>();
                params2.put(HttpHeaders.ACCEPT, headers.getAccept().iterator().next().toString());
                return loadData(result.getHeaders().getLocation().toString(), params2);
            } else {
                return result.getBody();
            }
        } catch (HttpServerErrorException e) {
            LOG.error("Error when requesting remote data, url: {}. Response Status: {}\n, Body:",
                urlWithQuery.toString(), e.getStatusCode(), e.getResponseBodyAsString());
            throw new WebServiceIntegrationException("Unable to fetch remote data.", e);
        } catch (Exception e) {
            LOG.error("Error when requesting remote data, url: {}.", urlWithQuery.toString(), e);
            throw new WebServiceIntegrationException("Unable to fetch remote data.", e);
        }
    }

    private HttpHeaders processHeaders(Map<String, String> params) {
        final HttpHeaders headers = new HttpHeaders();
        // Set default accept type to JSON-LD
        headers.set(HttpHeaders.ACCEPT, Constants.APPLICATION_JSON_LD_TYPE);
        for (String header : SUPPORTED_HEADERS) {
            if (params.containsKey(header)) {
                headers.set(header, params.get(header));
                params.remove(header);
            }
        }
        return headers;
    }

    private URI prepareUri(String remoteUrl, Map<String, String> queryParams) {
        final StringBuilder sb = new StringBuilder(remoteUrl);
        boolean containsQueryString = remoteUrl.matches("^.+\\?.+=.+$");
        for (Map.Entry<String, String> e : queryParams.entrySet()) {
            sb.append(!containsQueryString ? '?' : '&');
            sb.append(e.getKey()).append('=').append(e.getValue());
            containsQueryString = true;
        }
        return URI.create(sb.toString());
    }
}

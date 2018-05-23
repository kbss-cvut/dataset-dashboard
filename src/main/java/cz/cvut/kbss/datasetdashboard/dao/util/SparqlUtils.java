package cz.cvut.kbss.datasetdashboard.dao.util;

import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URLEncoder;
import java.util.Map;
import org.apache.jena.query.ParameterizedSparqlString;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SparqlUtils {

    protected static final Logger LOG = LoggerFactory.getLogger(SparqlUtils.class);

    /**
     * Checks, whether the given string represents an IRI. i.e. whether it has the form < X > and X is a valid URI
     *
     * @param val
     * @return
     */
    private static String asIRI(final String val) {
        if (val.startsWith("<") && val.endsWith(">")) {
            String s = val.substring(1,val.length()-1);
            try {
                new URI(s);
                return s;
            } catch (Exception e) {
                return null;
            }
        } else {
            return null;
        }
    }

    /**
     * Sets a single binding set to the variables of a query
     */
    public static ParameterizedSparqlString setSingleBinding(final ParameterizedSparqlString pss, final Map<String,String> bindings) {
        bindings.entrySet().stream().forEach(
            (e) -> {
                if ( asIRI(e.getValue()) != null) {
                    pss.setIri(e.getKey(),asIRI(e.getValue()));
                } else {
                    pss.setLiteral(e.getKey(),e.getValue());
                }
            }
        );
        return pss;
    }

    public static String getDescriptorGraphIri(final String descriptorType, final String originalGraphIri) {
        try {
            final StringBuilder b = new StringBuilder(descriptorType);
            if ( originalGraphIri != null ) {
                b.append("--").append(
                    URLEncoder.encode(originalGraphIri, "utf-8"));
            }
            return b.toString();
        } catch (UnsupportedEncodingException e) {
            LOG.warn("Url Encoding failed, using original unencoded version");
            return new StringBuilder(descriptorType).append("--").append(originalGraphIri).toString();
        }
    }

    private static String normalizeUrl(final String url) {
        return url.replace("/","_").replace(".","_");
    }

    public static String getRepositoryIdForSparqlEndpoint(final String endpointUrl) {
        if(endpointUrl.matches("http://(.*)")) {
            return normalizeUrl(endpointUrl.substring(7));
        } else if (endpointUrl.matches("http(s)?://(.*)")) {
            return normalizeUrl("s-"+endpointUrl.substring(8));
        } else {
            throw new IllegalArgumentException();
        }
    }

    public static  String createUrlString(final Map<String,String> map) {
        final StringBuilder urlBuilder = new StringBuilder();
        for (final Map.Entry<String, String> e : map.entrySet()) {
            urlBuilder.append("&" + e.getKey() + "=" + e.getValue());
        }
        return urlBuilder.toString();
    }
}

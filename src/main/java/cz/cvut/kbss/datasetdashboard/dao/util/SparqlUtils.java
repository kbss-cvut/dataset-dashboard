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
     * Checks, whether the given string represents an IRI. I.e. whether it has the form < X > and X is a valid URI
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
            return new StringBuilder(descriptorType).append("--").append(
                URLEncoder.encode(originalGraphIri, "utf-8")).toString();
        } catch (UnsupportedEncodingException e) {
            LOG.warn("Url Encoding failed, using original unencoded version");
            return new StringBuilder(descriptorType).append("--").append(originalGraphIri).toString();
        }
    }
}

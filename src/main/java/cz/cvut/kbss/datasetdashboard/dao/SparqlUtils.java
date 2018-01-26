package cz.cvut.kbss.datasetdashboard.dao;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.apache.jena.graph.NodeFactory;
import org.apache.jena.query.ParameterizedSparqlString;
import org.apache.jena.query.Query;
import org.apache.jena.sparql.core.Var;
import org.apache.jena.sparql.engine.binding.Binding;
import org.apache.jena.sparql.engine.binding.BindingFactory;

public class SparqlUtils {

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
}

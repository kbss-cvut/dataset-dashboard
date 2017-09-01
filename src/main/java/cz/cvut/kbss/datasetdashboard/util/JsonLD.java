package cz.cvut.kbss.datasetdashboard.util;

import java.io.StringReader;
import java.io.StringWriter;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.riot.RDFDataMgr;

public class JsonLD {
    public static String toJsonLd(String turtle) {
        final Model m = ModelFactory.createDefaultModel();
        if (turtle != null) {
            m.read(new StringReader(turtle), null, "TURTLE");
        }
        final StringWriter w = new StringWriter();
        RDFDataMgr.write(w, m, org.apache.jena.riot.RDFLanguages.JSONLD);
        return w.toString();
    }
}

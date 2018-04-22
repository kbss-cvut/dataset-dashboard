package cz.cvut.kbss.datasetdashboard.dao.util;

import cz.cvut.kbss.datasetdashboard.dao.util.SparqlUtils;
import java.util.Collections;
import org.apache.jena.graph.NodeFactory;
import org.apache.jena.query.ParameterizedSparqlString;
import org.apache.jena.vocabulary.RDFS;
import org.junit.Assert;
import org.junit.Test;

public class SparqlUtilsTest {

    private String queryString = "SELECT * {?s ?p ?o}";

    @Test
    public void testNoBindingParameterizedSparql() {
        RDFS.getURI();
        ParameterizedSparqlString pss = new ParameterizedSparqlString(queryString);
        pss = SparqlUtils.setSingleBinding(pss, Collections.emptyMap());
        Assert.assertEquals(0, pss.getVariableParameters().size());
    }

    @Test
    public void testSingleLiteralBindingParameterizedSparql() {
        ParameterizedSparqlString pss = new ParameterizedSparqlString(queryString);
        pss = SparqlUtils.setSingleBinding(pss, Collections.singletonMap("s","a"));
        Assert.assertEquals(1, pss.getVariableParameters().size());
        Assert.assertTrue(pss.getVariableParameters().containsKey("s"));
        Assert.assertTrue(pss.getVariableParameters().containsValue(NodeFactory.createLiteral("a")));
    }

    @Test
    public void testSingleIRIBindingParameterizedSparql() {
        ParameterizedSparqlString pss = new ParameterizedSparqlString(queryString);
        pss = SparqlUtils.setSingleBinding(pss, Collections.singletonMap("s","<http://example.org/a>"));
        System.out.println(pss);
        Assert.assertEquals(1, pss.getVariableParameters().size());
        Assert.assertTrue(pss.getVariableParameters().containsKey("s"));
        Assert.assertTrue(pss.getVariableParameters().containsValue(NodeFactory.createURI("http://example.org/a")));
    }
}

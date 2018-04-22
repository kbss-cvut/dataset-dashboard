package cz.cvut.kbss.datasetdashboard.util;

import java.util.Arrays;
import java.util.Collection;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;

@RunWith(Parameterized.class)
public class ServiceUtilsTest {
    @Parameterized.Parameters
    public static Collection<Object[]> data() {
        return Arrays.asList(new Object[][] {
            { "http://onto.fel.cvut.cz/rdf4j-server/repositories/wdr-example", "onto_fel_cvut_cz_rdf4j-server_repositories_wdr-example" },
            { "https://linked.opendata.cz/sparql", "s-linked_opendata_cz_sparql" },
            { "https://ruian.linked.opendata.cz/sparql", "s-ruian_linked_opendata_cz_sparql" }
        });
    }

    private String endpointUrl;
    private String repositoryId;

    public ServiceUtilsTest(final String endpointUrl, final String repositoryId) {
        this.endpointUrl = endpointUrl;
        this.repositoryId = repositoryId;
    }

    @Test
    public void testGetRepositoryIdForSparqlEndpoint() {
        Assert.assertEquals(repositoryId,ServiceUtils.getRepositoryIdForSparqlEndpoint(endpointUrl));
    }
}

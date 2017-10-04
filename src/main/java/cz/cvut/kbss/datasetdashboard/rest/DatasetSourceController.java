package cz.cvut.kbss.datasetdashboard.rest;

import cz.cvut.kbss.datasetdashboard.rest.dto.model.RawJson;
import cz.cvut.kbss.datasetdashboard.service.DatasetSourceService;
import java.util.Formatter;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dataset-source")
public class DatasetSourceController {

    @Autowired
    private DatasetSourceService datasetSourceService;

    /**
     * Returns all registered dataset sources.
     *
     * @return a dataset source list in JSON
     */
    @RequestMapping(path = "/", method = RequestMethod.GET, produces = MediaType
        .APPLICATION_JSON_VALUE)
    public RawJson getAll() {
        return datasetSourceService.getDataSources();
    }

    /**
     * Registers a new dataset source.
     *
     * @param downloadUrl a download URL of a dataset source
     * @param endpointUrl an endpoint URL (for SPARQLEndpointDatasetSource and
     *                    NamedGraphSPARQLEndpointDatasetSource)
     * @param graphIri    a graph IRI inside the SPARQL endpoint or null to denote the whole
     *                    endpoint
     * @return a dataset source list in JSON
     */
    @RequestMapping(path = "/", method = RequestMethod.PUT, produces = MediaType
        .APPLICATION_JSON_VALUE)
    public String register(@RequestParam(required = false) String downloadUrl, @RequestParam
        (required = false) String endpointUrl, @RequestParam(required = false) String graphIri) {
        if (graphIri != null && endpointUrl != null) {
            return datasetSourceService.register(endpointUrl, graphIri);
        } else if (endpointUrl != null) {
            return datasetSourceService.register(endpointUrl, null);
        } else if (downloadUrl != null) {
            return datasetSourceService.register(downloadUrl);
        }
        throw new RuntimeException(new Formatter().format("Insufficient data provided, "
            + "endpoint=%s, graph=%s, download=%s", endpointUrl, graphIri, downloadUrl).toString());
    }

    /**
     * Return JSON-LD representation of a SPARQL construct query.
     *
     * @param id       Identifier (IRI) of the dataset source to execute query on
     * @param bindings variable bindings to be passed to the SPARQL values.
     * @return query result in the JSON-LD format
     */
    @RequestMapping(path = "/actions/query", method = RequestMethod.GET, produces = MediaType
        .APPLICATION_JSON_VALUE)
    public RawJson executeQuery(@RequestParam String id, @RequestParam Map<String, String>
        bindings) {
        String queryFile = bindings.remove("queryFile");

        return datasetSourceService.getSparqlConstructResult("/query/" + queryFile + ".rq", id,
            bindings);
    }

    /**
     * Return a list of dataset descriptors.
     *
     * @param id                Identifier (IRI) of the dataset source
     * @param descriptorTypeIri IRI of the descriptor type
     * @return a JSON-LD formatted list of dataset descriptors
     */
    @RequestMapping(path = "/descriptor", method = RequestMethod.GET, produces = MediaType
        .APPLICATION_JSON_VALUE)
    public RawJson getDescriptorsForDatasetSource(@RequestParam String id, @RequestParam String
        descriptorTypeIri) {
        return datasetSourceService.getDescriptorsForDatasetSource(id, descriptorTypeIri);
    }
}

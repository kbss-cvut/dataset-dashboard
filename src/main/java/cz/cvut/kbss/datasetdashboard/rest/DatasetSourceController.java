package cz.cvut.kbss.datasetdashboard.rest;

import cz.cvut.kbss.datasetdashboard.rest.dto.model.RawJson;
import cz.cvut.kbss.datasetdashboard.service.DatasetSourceService;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dataset-source")
public class DatasetSourceController {

    @Autowired
    private DatasetSourceService datasetSourceService;

    @RequestMapping(path = "/", method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public RawJson getAll() {
        return datasetSourceService.getDataSources();
    }

    @RequestMapping(path = "/", method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public String registerNamedGraph(
        @RequestParam(required = false) String downloadUrl,
        @RequestParam(required = false)  String endpointUrl,
        @RequestParam(required = false)  String graphIri) {
        if (graphIri != null && endpointUrl != null) {
            return datasetSourceService.register(endpointUrl, graphIri);
        } else if (endpointUrl != null) {
            return datasetSourceService.register(endpointUrl, null);
        } else if (downloadUrl != null) {
            return datasetSourceService.register(downloadUrl);
        }
        throw new RuntimeException("Insufficient data provided " +
            "endpoint="+endpointUrl+", " +
            "graph="+graphIri+", " +
            "download="+ downloadUrl
        );
    }

    /**
     * Return JSON-LD represetnation of the SPARQL construct query.
     * @param id
     * @param bindings
     * @return
     */
    @RequestMapping(path = "/actions/query", method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public RawJson executeQuery(
        @RequestParam String id,
        @RequestParam Map<String,String> bindings) {
        String queryFile  = bindings.remove("queryFile");

        return datasetSourceService.getSparqlConstructResult(
            "/query/" + queryFile + ".rq", id, bindings);
    }

    /**
     * Return a list of descriptor ids.
     * @param id
     * @param descriptorTypeIri
     * @return
     */
    @RequestMapping(path = "/descriptor", method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public RawJson getDescriptorsForDatasetSource (
        @RequestParam String id,
        @RequestParam String descriptorTypeIri) {
        return datasetSourceService.getDescriptorsForDatasetSource(id, descriptorTypeIri);
    }
}

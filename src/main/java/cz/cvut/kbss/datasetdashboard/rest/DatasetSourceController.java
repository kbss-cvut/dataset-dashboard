package cz.cvut.kbss.datasetdashboard.rest;

import cz.cvut.kbss.datasetdashboard.rest.dto.model.RawJson;
import cz.cvut.kbss.datasetdashboard.service.DatasetSourceService;
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

    @RequestMapping(path = "/registerEndpoint", method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public Integer registerEndpoint(
        @RequestParam String endpointUrl) {
        return datasetSourceService.register(endpointUrl, null);
    }

    @RequestMapping(path = "/registerNamedGraph", method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public Integer registerNamedGraph(
        @RequestParam String endpointUrl,
        @RequestParam String graphIri) {
        return datasetSourceService.register(endpointUrl, graphIri);
    }

    @RequestMapping(path = "/registerUrl", method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public Integer registerUrl(
        @RequestParam String downloadUrl) {
        return datasetSourceService.register(downloadUrl);
    }

    @RequestMapping(path = "/{id}/executeQuery", method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public RawJson executeQuery(
        @PathVariable Integer id,
        @RequestParam String queryFile) {
        return datasetSourceService.getSparqlConstructResult("/query/" + queryFile + ".rq", id);
    }
    
    @RequestMapping(path = "/{id}/lastDescriptor", method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public RawJson getLastDescriptor(
        @PathVariable Integer id,
        @RequestParam String descriptorType) {
        return datasetSourceService.getLastDescriptor(id, descriptorType);
    }

    @RequestMapping(path = "/all", method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public RawJson executeQuery() {
        return datasetSourceService.getDataSources();
    }

}

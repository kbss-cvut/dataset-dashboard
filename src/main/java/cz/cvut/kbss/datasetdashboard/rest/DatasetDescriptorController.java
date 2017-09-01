package cz.cvut.kbss.datasetdashboard.rest;

import cz.cvut.kbss.datasetdashboard.rest.dto.model.RawJson;
import cz.cvut.kbss.datasetdashboard.service.DatasetDescriptorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dataset-descriptor")
public class DatasetDescriptorController {

    @Autowired
    private DatasetDescriptorService service;

    @RequestMapping(path = "/{id}/actions/content", method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public RawJson getDescriptorContent (
        @PathVariable String id,
        @RequestParam(required = false) String fileName) {
        return service.getDescriptorContent(id, fileName);
    }

    @RequestMapping(path = "/actions/compute", method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public String computeDescriptor(
        @RequestParam String datasetSourceId,
        @RequestParam String descriptorTypeIri) {
        return service.computeDescriptorForDatasetSource(datasetSourceId, descriptorTypeIri);
    }
}

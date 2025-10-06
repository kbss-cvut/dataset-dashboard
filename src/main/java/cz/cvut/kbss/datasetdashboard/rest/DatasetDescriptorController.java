package cz.cvut.kbss.datasetdashboard.rest;

import cz.cvut.kbss.datasetdashboard.rest.dto.model.RawJson;
import cz.cvut.kbss.datasetdashboard.service.DatasetDescriptorService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/rest/dataset-descriptor")
public class DatasetDescriptorController {

    private final DatasetDescriptorService service;

    public DatasetDescriptorController(DatasetDescriptorService service) {
        this.service = service;
    }

    @RequestMapping(path = "/actions/content", method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public RawJson getDescriptorContent(
        @RequestParam String id,
        @RequestParam(required = false) String fileName) {
        return service.getDescriptorContent(id, fileName);
    }

    @RequestMapping(path = "/actions/admin/compute", method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public RawJson computeDescriptor(
        @RequestParam String datasetSourceId,
        @RequestParam String descriptorTypeIri) {
        return service.computeDescriptorForDatasetSource(datasetSourceId, descriptorTypeIri);
    }

    @RequestMapping(path = "/actions/admin/remove", method = RequestMethod.GET,
                    produces = MediaType.APPLICATION_JSON_VALUE)
    public String removeDescriptor(@RequestParam String datasetDescriptorIri) {
        return service.removeDescriptorForDatasetSource(datasetDescriptorIri);
    }
}

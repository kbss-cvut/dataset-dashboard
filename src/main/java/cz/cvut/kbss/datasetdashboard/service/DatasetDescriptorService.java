package cz.cvut.kbss.datasetdashboard.service;

import cz.cvut.kbss.datasetdashboard.dao.DatasetDescriptorDao;
import cz.cvut.kbss.datasetdashboard.rest.dto.model.RawJson;
import cz.cvut.kbss.datasetdashboard.util.JsonLD;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DatasetDescriptorService {

    @Autowired
    private DatasetDescriptorDao datasetDescriptorDao;

    public RawJson getDescriptorContent(
        final String descriptorId,
        final String fileName
    ) {
        return new RawJson(JsonLD.toJsonLd(
            datasetDescriptorDao.getDescriptorContent(descriptorId, fileName)
        ));
    }

    public String computeDescriptorForDatasetSource(
        final String datasetSourceId,
        final String descriptorType) {
        return datasetDescriptorDao.computeDescriptorForDatasetSource(
            datasetSourceId,
            descriptorType
        ).getId();
    }
}

package cz.cvut.kbss.datasetdashboard.service;

import cz.cvut.kbss.datasetdashboard.dao.DatasetDescriptorDao;
import cz.cvut.kbss.datasetdashboard.rest.dto.model.RawJson;
import cz.cvut.kbss.datasetdashboard.util.JsonLd;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DatasetDescriptorService {

    @Autowired
    private DatasetDescriptorDao datasetDescriptorDao;

    @Transactional
    public RawJson getDescriptorContent(final String descriptorId, final String fileName) {
        return new RawJson(JsonLd.toJsonLd(datasetDescriptorDao.getDescriptorContent(descriptorId,
            fileName)));
    }

    @Transactional
    public String computeDescriptorForDatasetSource(final String datasetSourceId, final String
        descriptorType) {
        return datasetDescriptorDao.computeDescriptorForDatasetSource(datasetSourceId,
            descriptorType).getId();
    }
}

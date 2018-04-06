package cz.cvut.kbss.datasetdashboard.service;

import cz.cvut.kbss.datasetdashboard.dao.DatasetDescriptorDao;
import cz.cvut.kbss.datasetdashboard.rest.dto.model.RawJson;
import cz.cvut.kbss.datasetdashboard.util.JsonLd;
import cz.cvut.kbss.datasetdashboard.util.ServiceUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service public class DatasetDescriptorService {

    @Autowired private DatasetDescriptorDao datasetDescriptorDao;

    @Transactional
    public RawJson getDescriptorContent(final String descriptorId, final String fileName) {
        try {
            return new RawJson(
                JsonLd.toJsonLd(datasetDescriptorDao.getDescriptorContent(descriptorId, fileName)));
        } catch (Exception e) {
            throw new DatasetDescriptorServiceException("Unknown error", e);
        }
    }

    @Transactional public RawJson computeDescriptorForDatasetSource(final String datasetSourceId,
                                                                    final String descriptorType) {
        try {
            return new RawJson(ServiceUtils.outputDescriptor(datasetDescriptorDao
                .computeDescriptorForDatasetSource(datasetSourceId, descriptorType)).toString());
        } catch (Exception e) {
            throw new DatasetDescriptorServiceException("Unknown error", e);
        }
    }

    @Transactional public String removeDescriptorForDatasetSource(final String datasetDescriptorIri) {
        try {
            return datasetDescriptorDao
                .removeDescriptorForDatasetSource(datasetDescriptorIri).getId();
        } catch (Exception e) {
            throw new DatasetDescriptorServiceException("Unknown error", e);
        }
    }
}

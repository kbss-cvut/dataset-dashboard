package cz.cvut.kbss.datasetdashboard.dao.descriptors;

import cz.cvut.kbss.ddo.Vocabulary;
import java.util.HashMap;
import java.util.Map;
import javax.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Repository;
import org.springframework.web.context.annotation.ApplicationScope;

@Repository @ApplicationScope @PropertySource("classpath:config.properties")
public class DescriptorComputerParameterRegistry {

    private static final Logger LOG = LoggerFactory.getLogger(DescriptorComputerParameterRegistry.class);

    private final Map<String,DescriptorComputerSpecification> spec = new HashMap<>();

    @Autowired private Environment environment;

    @PostConstruct
    public void init() {
        final DescriptorComputerSpecification sSpo = new DescriptorComputerSpecification("compute-spo-summary-descriptor");
        register(Vocabulary.s_c_spo_summary_descriptor, sSpo );

        final DescriptorComputerSpecification sSpoEnh = new DescriptorComputerSpecification("compute-spo-summary-with-marginals-descriptor");
        sSpoEnh.add("marginalsDefsFileUrl", environment.getProperty("spipes.service.wdrDefsFileUrl") );
        sSpoEnh.add("marginalsFileUrl", environment.getProperty("spipes.service.wdrFileUrl") );
        register(Vocabulary.ONTOLOGY_IRI_dataset_descriptor
                 + "/spo-summary-with-marginals-descriptor", sSpoEnh );

        final DescriptorComputerSpecification sTemporal = new DescriptorComputerSpecification("compute-temporal-v1-descriptor");
        register(Vocabulary.s_c_temporal_dataset_descriptor, sTemporal );
    }

    private void register(final String datasetDescriptorTypeIri,
                                final DescriptorComputerSpecification specification) {
        if (spec.containsKey(datasetDescriptorTypeIri)) {
            LOG.warn("Overriding an existing dataset descriptor specification for " + datasetDescriptorTypeIri);
        }

        spec.put(datasetDescriptorTypeIri,specification);
    }

    public DescriptorComputerSpecification get(final String datasetDescriptorTypeIri) {
        return spec.get(datasetDescriptorTypeIri);
    }
}

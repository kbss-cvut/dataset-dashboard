package cz.cvut.kbss.datasetdashboard.persistence;

import cz.cvut.kbss.jopa.model.EntityManagerFactory;
import static cz.cvut.kbss.jopa.model.JOPAPersistenceProperties.*;
import cz.cvut.kbss.jopa.model.JOPAPersistenceProvider;
import cz.cvut.kbss.ontodriver.config.OntoDriverProperties;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;

/**
 * Sets up persistence and provides {@link EntityManagerFactory} as Spring bean.
 */
@Configuration
@PropertySource("classpath:config.properties")
public class PersistenceFactory {

    private static final Map<String, String> DEFAULT_PARAMS = initParams();

    @Autowired
    private Environment environment;

    private EntityManagerFactory emf;

    private static Map<String, String> initParams() {
        final Map<String, String> map = new HashMap<>();
        map.put(OntoDriverProperties.ONTOLOGY_LANGUAGE, "en");
        map.put(SCAN_PACKAGE, "cz.cvut.kbss.ddo.model");
        map.put(JPA_PERSISTENCE_PROVIDER, JOPAPersistenceProvider.class.getName());
        return map;
    }

    static Map<String, String> getDefaultParams() {
        return Collections.unmodifiableMap(DEFAULT_PARAMS);
    }

    @Bean
    @Primary
    public EntityManagerFactory getEntityManagerFactory() {
        return emf;
    }

    @PostConstruct
    private void init() {
        final Map<String, String> properties = new HashMap<>(DEFAULT_PARAMS);
        properties.put(ONTOLOGY_PHYSICAL_URI_KEY, environment.getProperty("jopa.ddo.repositoryUrl"));
        properties.put(DATA_SOURCE_CLASS, environment.getProperty("jopa.ddo.driver"));
        properties.put(CACHE_ENABLED, environment.getProperty("jopa.ddo.cache_enabled"));
        this.emf = cz.cvut.kbss.jopa.Persistence.createEntityManagerFactory("ddPU", properties);
    }

    @PreDestroy
    private void close() {
        if (emf.isOpen()) {
            emf.close();
        }
    }
}

package cz.cvut.kbss.datasetdashboard.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableMBeanExport;
import org.springframework.context.annotation.Import;

@Configuration
@EnableMBeanExport
@Import({WebAppConfig.class, ServiceConfig.class})
public class AppConfig {
}

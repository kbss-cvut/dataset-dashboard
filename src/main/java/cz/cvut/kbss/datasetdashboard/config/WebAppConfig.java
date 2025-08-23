package cz.cvut.kbss.datasetdashboard.config;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.ResourceHttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.charset.StandardCharsets;

@Configuration
@EnableWebMvc
public class WebAppConfig implements WebMvcConfigurer {

    @Bean(name = "objectMapper")
    @Primary
    public ObjectMapper objectMapper() {
        return createJsonObjectMapper();
    }

    @Bean
    public HttpMessageConverter<?> stringHttpMessageConverter() {
        return new StringHttpMessageConverter(StandardCharsets.UTF_8);
    }

    @Bean
    public HttpMessageConverter<?> jsonHttpMessageConverter() {
        final MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
        converter.setObjectMapper(objectMapper());
        return converter;
    }

    @Bean
    public HttpMessageConverter<?> resourceHttpMessageConverter() {
        return new ResourceHttpMessageConverter();
    }

    /**
     * Creates an {@link ObjectMapper} for processing regular JSON.
     * <p>
     * This method is public static so that it can be used by the test environment as well.
     *
     * @return {@code ObjectMapper} instance
     */
    public static ObjectMapper createJsonObjectMapper() {
        final ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.setSerializationInclusion(JsonInclude.Include.ALWAYS);
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        // JSR 310 (Java 8 DateTime API)
        objectMapper.registerModule(new JavaTimeModule());
        // Serialize datetime as ISO strings
        objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        return objectMapper;
    }
}

package cz.cvut.kbss.datasetdashboard.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.hc.client5.http.classic.HttpClient;
import org.apache.hc.client5.http.impl.DefaultRedirectStrategy;
import org.apache.hc.client5.http.impl.classic.HttpClientBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.http.converter.FormHttpMessageConverter;
import org.springframework.http.converter.ResourceHttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;

@Configuration
@EnableTransactionManagement
public class ServiceConfig {

    @Bean
    public RestTemplate restTemplate(ObjectMapper objectMapper) {
        final RestTemplate restTemplate = new RestTemplate();

        // HttpClient 5 default redirect strategy automatically follows POST redirects as well
        final HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();
        final HttpClient httpClient = HttpClientBuilder.create()
                                                       .setRedirectStrategy(new DefaultRedirectStrategy())
                                                       .build();
        factory.setHttpClient(httpClient);
        restTemplate.setRequestFactory(factory);

        final MappingJackson2HttpMessageConverter jacksonConverter = new MappingJackson2HttpMessageConverter();
        jacksonConverter.setObjectMapper(objectMapper);
        final StringHttpMessageConverter stringConverter = new StringHttpMessageConverter(StandardCharsets.UTF_8);
        restTemplate.setMessageConverters(
                Arrays.asList(jacksonConverter, stringConverter, new ResourceHttpMessageConverter(),
                              new FormHttpMessageConverter()));
        return restTemplate;
    }
}

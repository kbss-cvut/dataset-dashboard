package cz.cvut.kbss.datasetdashboard.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import cz.cvut.kbss.datasetdashboard.util.Constants;
import java.nio.charset.Charset;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.servlet.config.annotation.DefaultServletHandlerConfigurer;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
@EnableWebMvc
@Import({RestConfig.class,SecurityConfig.class})
public class WebAppConfig extends WebMvcConfigurerAdapter {

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
//        registry.addResourceHandler("/resources/**")
//            .addResourceLocations("/resources/").setCacheControl(
//            CacheControl.maxAge(7, TimeUnit.DAYS));
//        registry.addResourceHandler("/js/**")
//            .addResourceLocations("/js/").setCacheControl(
//            CacheControl.maxAge(24, TimeUnit.HOURS));
//        registry.setOrder(-1);
//        registry.addResourceHandler("/**").addResourceLocations("/index.html").setCachePeriod(0);
    }

    @Override public void addViewControllers(ViewControllerRegistry registry) {
        ////        super.addViewControllers(registry);
        registry.addViewController("/").setViewName("forward:/index.html"); // Same thing without this line
        registry.addViewController("/namespaces").setViewName("forward:/index.html");
        super.addViewControllers(registry); // and this line...
//        registry.addViewController("/{spring:\\w+}")
//                .setViewName("forward:/");
//        registry.addViewController("/**/{spring:\\w+}")
//                .setViewName("forward:/");
//        registry.addViewController("/{spring:\\w+}/**{spring:?!(\\.js|\\.css)$}")
//                .setViewName("forward:/");
    }

//    @Bean
//    public WebServerFactoryCustomizer containerCustomizer() {
//        return container -> {
//            container.addErrorPages(new ErrorPage(HttpStatus.NOT_FOUND,
//                "/notFound"));
//        };
//    }



    @Override
    public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
        configurer.enable();
    }

//    /**
//     * TODO.
//     */
//    @Bean
//    public InternalResourceViewResolver setupViewResolver() {
//        InternalResourceViewResolver resolver = new InternalResourceViewResolver();
//        resolver.setViewClass(JstlView.class);
//        resolver.setPrefix("/WEB-INF/");
//        resolver.setSuffix(".html");
//        return resolver;
//    }
//
//    @Bean(name = "multipartResolver")
//    public MultipartResolver multipartResolver() {
//        return new StandardServletMultipartResolver();
//    }
//
    @Override
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        final MappingJackson2HttpMessageConverter converter =
            new MappingJackson2HttpMessageConverter();
        converter.setObjectMapper(objectMapper);
        converters.add(converter);
        final StringHttpMessageConverter stringConverter =
            new StringHttpMessageConverter(Charset.forName(
                Constants.UTF_8_ENCODING));
        converters.add(stringConverter);
        super.configureMessageConverters(converters);
    }
}

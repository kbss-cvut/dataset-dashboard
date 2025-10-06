package cz.cvut.kbss.datasetdashboard.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.expression.WebExpressionAuthorizationManager;
import org.springframework.security.web.servlet.util.matcher.PathPatternRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Collections;
import java.util.List;

@EnableWebSecurity
@EnableMethodSecurity
@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        final PathPatternRequestMatcher.Builder matcher = PathPatternRequestMatcher.withDefaults();
        http.authorizeHttpRequests(
                    auth -> auth.requestMatchers(matcher.matcher("/rest/dataset-descriptor/actions/admin/*"))
                                .access(new WebExpressionAuthorizationManager(
                                        "hasIpAddress('147.32.0.0/16') or hasIpAddress('127.0.0.1') or hasIpAddress('0:0:0:0:0:0:0:1')"))
                                .anyRequest().permitAll())
            .csrf(AbstractHttpConfigurer::disable)
            .cors((auth) -> auth.configurationSource(createCorsConfiguration()));
        return http.build();
    }

    private static CorsConfigurationSource createCorsConfiguration() {
        // Since we are using cookie-based sessions, we have to specify the URL of the clients (CORS allowed origins)
        final CorsConfiguration corsConfiguration = new CorsConfiguration().applyPermitDefaultValues();
        corsConfiguration.setAllowedMethods(Collections.singletonList("*"));
        corsConfiguration.setAllowedOrigins(List.of("*"));
        corsConfiguration.addExposedHeader(HttpHeaders.LOCATION);
        corsConfiguration.addExposedHeader(HttpHeaders.CONTENT_DISPOSITION);
        final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);
        return source;
    }
}

package cz.cvut.kbss.datasetdashboard.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.expression.WebExpressionAuthorizationManager;
import org.springframework.security.web.servlet.util.matcher.PathPatternRequestMatcher;

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
            .csrf(AbstractHttpConfigurer::disable);
        return http.build();
    }
}

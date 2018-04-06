package cz.cvut.kbss.datasetdashboard.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@EnableWebSecurity
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {
//    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
            .antMatchers("/rest/dataset-descriptor/actions/admin/*")
                .access("hasIpAddress('147.32.0.0/16') || hasIpAddress('127.0.0.1') || hasIpAddress('0:0:0:0:0:0:0:1')")
            .antMatchers("/**")
                .permitAll().and()
            .csrf().disable();
    }
}

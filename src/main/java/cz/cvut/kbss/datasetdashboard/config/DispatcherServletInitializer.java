package cz.cvut.kbss.datasetdashboard.config;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import org.springframework.web.context.request.RequestContextListener;
import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;

public class DispatcherServletInitializer extends
    AbstractAnnotationConfigDispatcherServletInitializer {

    @Override
    protected Class<?>[] getRootConfigClasses() {
        return new Class<?>[] {AppConfig.class};
    }

    @Override
    protected Class<?>[] getServletConfigClasses() {
        return null;
    }

    @Override
    protected String[] getServletMappings() {
        return new String[] {"/rest/*", "/static/*"};
    }

    @Override
    public void onStartup(ServletContext servletContext) throws ServletException {
        System.out.println("****** Application Context Initialization ******");

        servletContext.addListener(new RequestContextListener());
        super.onStartup(servletContext);
    }
}

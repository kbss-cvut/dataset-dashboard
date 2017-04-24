package cz.cvut.kbss.datasetdashboard.exception;

/**
 * Exception thrown when access to other application's web services fails.
 */
public class WebServiceIntegrationException extends RuntimeException {

    public WebServiceIntegrationException(String message, Throwable cause) {
        super(message, cause);
    }
}

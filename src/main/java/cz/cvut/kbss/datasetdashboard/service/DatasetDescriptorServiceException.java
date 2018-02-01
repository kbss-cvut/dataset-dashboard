package cz.cvut.kbss.datasetdashboard.service;

public class DatasetDescriptorServiceException extends RuntimeException {
    public DatasetDescriptorServiceException(String message) {
        super(message);
    }

    public DatasetDescriptorServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}

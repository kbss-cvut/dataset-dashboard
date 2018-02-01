package cz.cvut.kbss.datasetdashboard.service;

public class DatasetSourceServiceException extends RuntimeException {
    public DatasetSourceServiceException(String message) {
        super(message);
    }

    public DatasetSourceServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}

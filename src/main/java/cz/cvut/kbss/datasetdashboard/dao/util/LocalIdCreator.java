package cz.cvut.kbss.datasetdashboard.dao.util;

public class LocalIdCreator implements IdCreator {

    private String localId;

    public LocalIdCreator(String localId) {
        this.localId = localId;
    }

    public String createInstanceOf(final String owlClassIri) {
        return new StringBuilder(owlClassIri).append("-").append(localId).toString();
    }
}

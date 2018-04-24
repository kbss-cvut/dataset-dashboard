package cz.cvut.kbss.datasetdashboard.dao.util;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;

public class TimeSnapshotIdCreator implements IdCreator {

    private static final DateFormat F = new SimpleDateFormat("yyyyMMddHHmmssSSS");

    private String time;

    public static TimeSnapshotIdCreator create() {
        return new TimeSnapshotIdCreator(F.format(Calendar.getInstance().getTime()));
    }

    private TimeSnapshotIdCreator(String time) {
        this.time = time;
    }

    public String createInstanceOf(final String owlClassIri) {
        return new StringBuilder(owlClassIri).append("-").append(time).toString();
    }
}

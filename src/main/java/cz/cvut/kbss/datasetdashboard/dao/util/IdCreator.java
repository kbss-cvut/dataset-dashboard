package cz.cvut.kbss.datasetdashboard.dao.util;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;

public class IdCreator {

    private static final DateFormat F = new SimpleDateFormat("yyyyMMddHHmmssSSS");

    private String time;

    public static IdCreator create() {
        return new IdCreator(F.format(Calendar.getInstance().getTime()));
    }

    private IdCreator(String time) {
        this.time = time;
    }

    public String create(final String owlClassIri) {
        return new StringBuilder(owlClassIri).append("-").append(time).toString();
    }
}

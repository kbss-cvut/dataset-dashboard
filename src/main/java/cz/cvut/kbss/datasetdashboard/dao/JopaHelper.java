package cz.cvut.kbss.datasetdashboard.dao;

import cz.cvut.kbss.ddo.model.Thing;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class JopaHelper {

    public static <T extends Thing> T create(final Class<T> c, final String tIri, final String localId) {
        final T t;
        try {
            t = c.newInstance();
            t.setId(tIri + "-" + localId);
            final Set<String> types = new HashSet<>();
            types.add(tIri);
            t.setTypes(types);
            final Map<String, Set<String>> properties = new HashMap<>();
            t.setProperties(properties);
            return t;
        } catch (InstantiationException e) {
            e.printStackTrace();
            return null;
        } catch (IllegalAccessException e) {
            e.printStackTrace();
            return null;
        }
    }
}

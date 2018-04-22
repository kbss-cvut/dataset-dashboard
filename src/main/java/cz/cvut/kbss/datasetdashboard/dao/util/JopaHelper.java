package cz.cvut.kbss.datasetdashboard.dao.util;

import cz.cvut.kbss.datasetdashboard.model.util.EntityToOwlClassMapper;
import cz.cvut.kbss.ddo.model.Thing;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class JopaHelper {

    /**
     * Creates an empty JOPA entity of type <T> with typeIRI given by {@param c}.
     *
     * {@inheritDoc}
     */
    public static <T extends Thing> T create(final Class<T> c, final String localId) {
        return create(c, EntityToOwlClassMapper.getOwlClassForEntity(c),localId);
    }

    /**
     * Creates an empty JOPA entity of type <T>
     *
     * @param c entity class to be created
     * @param tIri ontology class IRI
     * @param localId local part of an identified of the instance representing the entity
     * @param <T> the actual type corresponding to c
     * @return an initialized entity
     */
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

package cz.cvut.kbss.datasetdashboard.model.util;

import cz.cvut.kbss.jopa.model.annotations.OWLClass;
import cz.cvut.kbss.jopa.model.annotations.Types;
import java.lang.reflect.Field;
import java.util.Set;

/**
 * Utility class for getting information about the entity - OWL class mapping.
 */
public class EntityToOwlClassMapper {

    private EntityToOwlClassMapper() {
        throw new AssertionError();
    }

    /**
     * Gets IRI of the OWL class mapped by the specified entity.
     *
     * @param entityClass Entity class
     * @return IRI of mapped OWL class (as String)
     */
    public static String getOwlClassForEntity(Class<?> entityClass) {
        final OWLClass owlClass = entityClass.getDeclaredAnnotation(OWLClass.class);
        if (owlClass == null) {
            throw new IllegalArgumentException("Class " + entityClass + " is not an entity.");
        }
        return owlClass.iri();
    }

    public static boolean isOfType(final Object entity, String s) {
        final String owlClass = getOwlClassForEntity(entity.getClass());
        if ( s.equals(owlClass)) {
            return true;
        };
        for(final Field f : entity.getClass().getDeclaredFields()) {
            f.setAccessible(true);
            if ( f.getDeclaredAnnotation(Types.class) != null ) {
                try {
                    return ((Set) (f.get(entity))).contains(s);
                } catch (IllegalAccessException e) {
                    e.printStackTrace();
                }
            }
        }
        return false;
    }
}

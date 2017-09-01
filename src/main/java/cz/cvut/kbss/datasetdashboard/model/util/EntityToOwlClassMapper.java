package cz.cvut.kbss.datasetdashboard.model.util;

import cz.cvut.kbss.jopa.model.annotations.OWLClass;
import cz.cvut.kbss.jopa.model.annotations.Types;
import java.util.Set;
import java.util.concurrent.atomic.AtomicBoolean;
import org.springframework.util.ReflectionUtils;

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

    /**
     * Checks, whether an object is of ontological type given by the IRI as string.
     *
     * @param entity  Java object under investigation
     * @param typeIri IRI of the type
     * @return true if the entity is of the given type and false otherwise
     */
    public static boolean isOfType(final Object entity, String typeIri) {
        final String owlClass = getOwlClassForEntity(entity.getClass());
        if (typeIri.equals(owlClass)) {
            return true;
        }
        final AtomicBoolean result = new AtomicBoolean(false);
        ReflectionUtils.doWithFields(entity.getClass(), field -> {
            ReflectionUtils.makeAccessible(field);
            Object f = field.get(entity);
            if ( ( f != null) && (((Set) f).contains(typeIri))) {
                result.set(true);
            }
        }, field -> field.getDeclaredAnnotation(Types.class) != null);

        return result.get();
    }
}

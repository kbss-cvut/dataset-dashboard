package cz.cvut.kbss.datasetdashboard.model.util;

import cz.cvut.kbss.datasetdashboard.dao.util.IdCreator;
import cz.cvut.kbss.datasetdashboard.dao.util.LocalIdCreator;
import cz.cvut.kbss.ddo.model.Thing;
import cz.cvut.kbss.jopa.model.annotations.OWLClass;
import cz.cvut.kbss.jopa.model.annotations.Types;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.atomic.AtomicBoolean;
import org.springframework.util.ReflectionUtils;

public class ModelHelper {

    private ModelHelper() {
        throw new AssertionError();
    }

    /**
     * Creates an empty JOPA entity of type <T> with typeIRI given by {@param c}.
     *
     * {@inheritDoc}
     */
    public static <T extends Thing> T create(final Class<T> c, final String localId) {
        return create(c, ModelHelper.getOwlClassForEntity(c),localId);
    }

    /**
     * Creates an empty JOPA entity of type <T> with typeIRI given by {@param c}.
     *
     * @param localId local part of an identified of the instance representing the entity
     * {@inheritDoc}
     */
    public static <T extends Thing> T create(final Class<T> c, final String tIri, final String localId) {
        return create(c,tIri,new LocalIdCreator(localId));
    }

    /**
     * Creates an empty JOPA entity of type <T>
     *
     * @param c entity class to be created
     * @param tIri ontology class IRI
     * @param creator creator for identifiers
     * @param <T> the actual type corresponding to c
     * @return an initialized entity
     */
    public static <T extends Thing> T create(final Class<T> c, final String tIri, final IdCreator creator) {
        final T t;
        try {
            t = c.newInstance();
            t.setId(creator.createInstanceOf(tIri));
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

    public static <T extends Thing> void addType(final T i, final String iri) {
        Set<String> types = i.getTypes();
        if ( types == null ) {
            types = new HashSet<>();
            i.setTypes(types);
        }
        types.add(iri);
    }

    public static <T extends Thing> void addObjectPropertyValue(final T i,
                                                          final String propIri,
                                                          final String valueIri) {
        Map<String,Set<String>> properties = i.getProperties();
        if ( properties == null ) {
            properties = new HashMap<>();
            i.setProperties(properties);
        }

        Set<String> set = properties.get(propIri);
        if ( set == null ) {
            set = new HashSet<>();
            properties.put(propIri,set);
        }

        set.add(valueIri);
    }

    public static <T extends Thing> String getSingleProperty(final T entity,
                                                             final String propertyName) {
        final Collection<String> res = entity.getProperties().get(propertyName);
        if ( res != null ) {
            return res.iterator().next();
        } else {
            return null;
        }
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
            if ((f != null) && (((Set) f).contains(typeIri))) {
                result.set(true);
            }
        }, field -> field.getDeclaredAnnotation(Types.class) != null);

        return result.get();
    }
}

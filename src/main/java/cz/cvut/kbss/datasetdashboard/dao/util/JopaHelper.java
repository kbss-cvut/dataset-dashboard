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
}

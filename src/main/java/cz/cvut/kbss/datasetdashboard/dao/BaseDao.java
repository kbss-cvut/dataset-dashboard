package cz.cvut.kbss.datasetdashboard.dao;

import cz.cvut.kbss.datasetdashboard.model.util.EntityToOwlClassMapper;
import cz.cvut.kbss.datasetdashboard.persistence.PersistenceException;
import cz.cvut.kbss.jopa.model.EntityManager;
import cz.cvut.kbss.jopa.model.annotations.OWLClass;
import java.net.URI;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Base implementation of the generic DAO.
 */
public abstract class BaseDao<T> implements GenericDao<T> {

    protected static final Logger LOG = LoggerFactory.getLogger(BaseDao.class);

    protected final Class<T> type;
    final URI typeUri;

    @Autowired
    private EntityManager em;

    protected BaseDao(Class<T> type) {
        this.type = type;
        this.typeUri = URI.create(EntityToOwlClassMapper.getOwlClassForEntity(type));
    }

    public T find(URI uri) {
        Objects.requireNonNull(uri);
        return em.find(type, uri);
    }

    /**
     * Finds all objects of the base type.
     *
     * @return a list of objects
     */
    public List<T> findAll() {
        return em.createNativeQuery("SELECT ?x WHERE { ?x a ?type . }", type)
            .setParameter("type", typeUri)
            .getResultList();
    }

    /**
     * Persists a new entity.
     *
     * @param entity Entity to persist
     */
    public void persist(T entity) {
        Objects.requireNonNull(entity);
        try {
            em.persist(entity);
        } catch (Exception e) {
            LOG.error("Error when persisting entity.", e);
            throw new PersistenceException(e);
        }
    }

    /**
     * Persists a collection of new entities.
     *
     * @param entities multiple entities to persist
     */
    public void persist(Collection<T> entities) {
        Objects.requireNonNull(entities);
        if (entities.isEmpty()) {
            return;
        }
        try {
            entities.forEach(e -> em.persist(e));
        } catch (Exception e) {
            LOG.error("Error when persisting entities.", e);
            throw new PersistenceException(e);
        }
    }

    /**
     * Updates an entity.
     *
     * @param entity Entity to update
     */
    public void update(T entity) {
        Objects.requireNonNull(entity);
        try {
            em.merge(entity);
        } catch (Exception e) {
            LOG.error("Error when updating entity.", e);
            throw new PersistenceException(e);
        }
    }

    /**
     * Removes an entity.
     *
     * @param entity Entity to remove
     */
    public void remove(T entity) {
        Objects.requireNonNull(entity);
        try {
            final T toRemove = em.merge(entity);
            assert toRemove != null;
            em.remove(toRemove);
        } catch (Exception e) {
            LOG.error("Error when removing entity.", e);
            throw new PersistenceException(e);
        }
    }

    /**
     * Removes multiple entities.
     *
     * @param entities entities to remove
     */
    public void remove(Collection<T> entities) {
        Objects.requireNonNull(entities);
        if (entities.isEmpty()) {
            return;
        }
        try {
            entities.forEach(entity -> {
                final T toRemove = em.merge(entity);
                em.remove(toRemove);
            });
        } catch (Exception e) {
            LOG.error("Error when removing entities.", e);
            throw new PersistenceException(e);
        }
    }

    /**
     * Checks whether an object with the uri exists.
     *
     * @param uri Entity identifier
     * @return true, if exists, false otherwise
     */
    public boolean exists(URI uri) {
        if (uri == null) {
            return false;
        }
        final String owlClass = type.getDeclaredAnnotation(OWLClass.class).iri();
        return em.createNativeQuery("ASK { ?individual a ?type . }", Boolean.class)
            .setParameter("individual", uri)
            .setParameter("type", URI.create(owlClass)).getSingleResult();
    }
}

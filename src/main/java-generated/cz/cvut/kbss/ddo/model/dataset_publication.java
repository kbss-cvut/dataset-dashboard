
package cz.cvut.kbss.ddo.model;

import java.util.Map;
import java.util.Set;
import cz.cvut.kbss.ddo.Vocabulary;
import cz.cvut.kbss.jopa.CommonVocabulary;
import cz.cvut.kbss.jopa.model.annotations.Id;
import cz.cvut.kbss.jopa.model.annotations.OWLAnnotationProperty;
import cz.cvut.kbss.jopa.model.annotations.OWLClass;
import cz.cvut.kbss.jopa.model.annotations.OWLObjectProperty;
import cz.cvut.kbss.jopa.model.annotations.ParticipationConstraint;
import cz.cvut.kbss.jopa.model.annotations.ParticipationConstraints;
import cz.cvut.kbss.jopa.model.annotations.Properties;
import cz.cvut.kbss.jopa.model.annotations.Types;


/**
 * This class was generated by the OWL2Java tool version $VERSION$
 * 
 */
@OWLClass(iri = Vocabulary.s_c_dataset_publication)
public class dataset_publication {

    @OWLAnnotationProperty(iri = CommonVocabulary.RDFS_LABEL)
    protected String name;
    @OWLAnnotationProperty(iri = CommonVocabulary.DC_DESCRIPTION)
    protected String description;
    @Types
    protected Set<String> types;
    @Id(generated = true)
    protected String id;
    @Properties
    protected Map<String, Set<String>> properties;
    @OWLObjectProperty(iri = Vocabulary.s_p_has_source)
    @ParticipationConstraints({
        @ParticipationConstraint(owlObjectIRI = Vocabulary.s_c_single_snapshot_dataset_source, min = 1)
    })
    protected Set<Thing> has_source;
    @OWLObjectProperty(iri = Vocabulary.s_p_has_publisher)
    @ParticipationConstraints({
        @ParticipationConstraint(owlObjectIRI = Vocabulary.s_c_publisher, min = 1, max = 1)
    })
    protected Set<Thing> has_publisher;
    @OWLObjectProperty(iri = Vocabulary.s_p_has_published_dataset_snapshot)
    @ParticipationConstraints({
        @ParticipationConstraint(owlObjectIRI = Vocabulary.s_c_dataset_snapshot, min = 1, max = 1)
    })
    protected Set<Thing> has_published_dataset_snapshot;

    public void setName(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    public void setTypes(Set<String> types) {
        this.types = types;
    }

    public Set<String> getTypes() {
        return types;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }

    public void setProperties(Map<String, Set<String>> properties) {
        this.properties = properties;
    }

    public Map<String, Set<String>> getProperties() {
        return properties;
    }

    public void setHas_source(Set<Thing> has_source) {
        this.has_source = has_source;
    }

    public Set<Thing> getHas_source() {
        return has_source;
    }

    public void setHas_publisher(Set<Thing> has_publisher) {
        this.has_publisher = has_publisher;
    }

    public Set<Thing> getHas_publisher() {
        return has_publisher;
    }

    public void setHas_published_dataset_snapshot(Set<Thing> has_published_dataset_snapshot) {
        this.has_published_dataset_snapshot = has_published_dataset_snapshot;
    }

    public Set<Thing> getHas_published_dataset_snapshot() {
        return has_published_dataset_snapshot;
    }

}

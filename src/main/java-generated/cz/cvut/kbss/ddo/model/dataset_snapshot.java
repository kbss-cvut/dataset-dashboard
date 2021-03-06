
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
@OWLClass(iri = Vocabulary.s_c_dataset_snapshot)
public class dataset_snapshot
    extends Thing
{
    @OWLObjectProperty(iri = Vocabulary.s_p_has_dataset)
    @ParticipationConstraints({
        @ParticipationConstraint(owlObjectIRI = Vocabulary.s_c_dataset, min = 1, max = 1)
    })
    protected Set<Thing> has_dataset;
    @OWLObjectProperty(iri = Vocabulary.s_p_inv_dot_has_published_dataset_snapshot)
    @ParticipationConstraints({
        @ParticipationConstraint(owlObjectIRI = Vocabulary.s_c_dataset_publication, min = 1, max = 1)
    })
    protected dataset_publication inv_dot_has_published_dataset_snapshot;
    @OWLObjectProperty(iri = Vocabulary.s_p_inv_dot_has_sub_dataset_snapshot)
    @ParticipationConstraints({
        @ParticipationConstraint(owlObjectIRI = Vocabulary.s_c_complex_dataset_snapshot, max = 1)
    })
    protected complex_dataset_snapshot inv_dot_has_sub_dataset_snapshot;

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

    public void setHas_dataset(Set<Thing> has_dataset) {
        this.has_dataset = has_dataset;
    }

    public Set<Thing> getHas_dataset() {
        return has_dataset;
    }

    public void setInv_dot_has_published_dataset_snapshot(dataset_publication inv_dot_has_published_dataset_snapshot) {
        this.inv_dot_has_published_dataset_snapshot = inv_dot_has_published_dataset_snapshot;
    }

    public dataset_publication getInv_dot_has_published_dataset_snapshot() {
        return inv_dot_has_published_dataset_snapshot;
    }

    public void setInv_dot_has_sub_dataset_snapshot(complex_dataset_snapshot inv_dot_has_sub_dataset_snapshot) {
        this.inv_dot_has_sub_dataset_snapshot = inv_dot_has_sub_dataset_snapshot;
    }

    public complex_dataset_snapshot getInv_dot_has_sub_dataset_snapshot() {
        return inv_dot_has_sub_dataset_snapshot;
    }

}

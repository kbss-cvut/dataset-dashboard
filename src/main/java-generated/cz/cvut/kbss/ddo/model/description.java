
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
@OWLClass(iri = Vocabulary.s_c_description)
public class description
    extends Thing
{

    @OWLObjectProperty(iri = Vocabulary.s_p_has_dataset_descriptor)
    @ParticipationConstraints({
        @ParticipationConstraint(owlObjectIRI = Vocabulary.s_c_dataset_descriptor, min = 1, max = 1)
    })
    protected dataset_descriptor has_dataset_descriptor;
    @OWLObjectProperty(iri = Vocabulary.s_p_has_source)
    @ParticipationConstraints({
        @ParticipationConstraint(owlObjectIRI = Vocabulary.s_c_single_snapshot_dataset_source, min = 1, max = 1)
    })
    protected Set<Thing> has_source;
    @OWLObjectProperty(iri = Vocabulary.s_p_is_description_of)
    @ParticipationConstraints({
        @ParticipationConstraint(owlObjectIRI = Vocabulary.s_c_described_data_artifact, min = 1, max = 1)
    })
    protected described_data_artifact is_description_of;

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

    public void setHas_dataset_descriptor(dataset_descriptor has_dataset_descriptor) {
        this.has_dataset_descriptor = has_dataset_descriptor;
    }

    public dataset_descriptor getHas_dataset_descriptor() {
        return has_dataset_descriptor;
    }

    public void setHas_source(Set<Thing> has_source) {
        this.has_source = has_source;
    }

    public Set<Thing> getHas_source() {
        return has_source;
    }

    public void setIs_description_of(described_data_artifact is_description_of) {
        this.is_description_of = is_description_of;
    }

    public described_data_artifact getIs_description_of() {
        return is_description_of;
    }
}

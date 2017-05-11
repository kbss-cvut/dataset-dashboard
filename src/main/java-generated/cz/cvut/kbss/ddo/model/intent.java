
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
@OWLClass(iri = Vocabulary.s_c_intent)
public class intent
    extends Thing
{

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
    @OWLObjectProperty(iri = Vocabulary.s_p_inv_dot_uses)
    @ParticipationConstraints({
        @ParticipationConstraint(owlObjectIRI = Vocabulary.s_c_dataset_exploration, min = 1, max = 1)
    })
    protected Set<Thing> inv_dot_uses;
    @OWLObjectProperty(iri = Vocabulary.s_p_inv_dot_has_intent)
    @ParticipationConstraints({
        @ParticipationConstraint(owlObjectIRI = Vocabulary.s_c_dataset_exploring_journalist, min = 1, max = 1)
    })
    protected Set<Thing> inv_dot_has_intent;

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

    public void setInv_dot_uses(Set<Thing> inv_dot_uses) {
        this.inv_dot_uses = inv_dot_uses;
    }

    public Set<Thing> getInv_dot_uses() {
        return inv_dot_uses;
    }

    public void setInv_dot_has_intent(Set<Thing> inv_dot_has_intent) {
        this.inv_dot_has_intent = inv_dot_has_intent;
    }

    public Set<Thing> getInv_dot_has_intent() {
        return inv_dot_has_intent;
    }

}

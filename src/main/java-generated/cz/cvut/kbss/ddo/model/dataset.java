
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
@OWLClass(iri = Vocabulary.s_c_dataset)
public class dataset
    extends Thing
{
    @OWLObjectProperty(iri = Vocabulary.s_p_inv_dot_offers_dataset)
    @ParticipationConstraints({
        @ParticipationConstraint(owlObjectIRI = Vocabulary.s_c_dataset_source, min = 1)
    })
    protected Set<dataset_source> inv_dot_offers_dataset;
    @OWLObjectProperty(iri = Vocabulary.s_p_inv_dot_has_subdataset)
    @ParticipationConstraints({
        @ParticipationConstraint(owlObjectIRI = Vocabulary.s_c_complex_dataset, max = 1)
    })
    protected complex_dataset inv_dot_has_subdataset;

    public void setInv_dot_offers_dataset(Set<dataset_source> inv_dot_offers_dataset) {
        this.inv_dot_offers_dataset = inv_dot_offers_dataset;
    }

    public Set<dataset_source> getInv_dot_offers_dataset() {
        return inv_dot_offers_dataset;
    }

    public void setInv_dot_has_subdataset(complex_dataset inv_dot_has_subdataset) {
        this.inv_dot_has_subdataset = inv_dot_has_subdataset;
    }

    public complex_dataset getInv_dot_has_subdataset() {
        return inv_dot_has_subdataset;
    }

}

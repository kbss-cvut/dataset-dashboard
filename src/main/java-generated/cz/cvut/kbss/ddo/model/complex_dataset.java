
package cz.cvut.kbss.ddo.model;

import cz.cvut.kbss.ddo.Vocabulary;
import cz.cvut.kbss.jopa.model.annotations.OWLClass;
import cz.cvut.kbss.jopa.model.annotations.OWLObjectProperty;
import cz.cvut.kbss.jopa.model.annotations.ParticipationConstraint;
import cz.cvut.kbss.jopa.model.annotations.ParticipationConstraints;
import java.util.Set;


/**
 * This class was generated by the OWL2Java tool version $VERSION$
 * 
 */
@OWLClass(iri = Vocabulary.s_c_complex_dataset)
public class complex_dataset
    extends dataset
{

    @OWLObjectProperty(iri = Vocabulary.s_p_has_subdataset)
    @ParticipationConstraints({
        @ParticipationConstraint(owlObjectIRI = Vocabulary.s_c_dataset, min = 2)
    })
    protected Set<dataset> has_subdataset;

    public void setHas_subdataset(Set<dataset> has_subdataset) {
        this.has_subdataset = has_subdataset;
    }

    public Set<dataset> getHas_subdataset() {
        return has_subdataset;
    }

}

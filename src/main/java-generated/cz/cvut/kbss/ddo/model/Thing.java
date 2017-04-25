
package cz.cvut.kbss.ddo.model;

import java.util.Map;
import java.util.Set;
import cz.cvut.kbss.ddo.Vocabulary;
import cz.cvut.kbss.jopa.CommonVocabulary;
import cz.cvut.kbss.jopa.model.annotations.Id;
import cz.cvut.kbss.jopa.model.annotations.OWLAnnotationProperty;
import cz.cvut.kbss.jopa.model.annotations.OWLClass;
import cz.cvut.kbss.jopa.model.annotations.OWLObjectProperty;
import cz.cvut.kbss.jopa.model.annotations.Properties;
import cz.cvut.kbss.jopa.model.annotations.Types;


/**
 * This class was generated by the OWL2Java tool version $VERSION$
 * 
 */
@OWLClass(iri = Vocabulary.s_c_Thing)
public class Thing {

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
    @OWLObjectProperty(iri = Vocabulary.s_p_has_target)
    protected Set<target_dataset_snapshot> has_target;
    @OWLObjectProperty(iri = Vocabulary.s_p_inv_dot_has_publisher)
    protected Set<dataset_publication> inv_dot_has_publisher;
    @OWLObjectProperty(iri = Vocabulary.s_p_has_item)
    protected Set<data_item> has_item;
    @OWLObjectProperty(iri = Vocabulary.s_p_is_created_by)
    protected Set<transformation> is_created_by;
    @OWLObjectProperty(iri = Vocabulary.s_p_has_member)
    protected Set<data_item> has_member;
    @OWLObjectProperty(iri = Vocabulary.s_p_has_dataset_descriptor)
    protected Set<dataset_descriptor> has_dataset_descriptor;
    @OWLObjectProperty(iri = Vocabulary.s_p_inv_dot_uses)
    protected Set<dataset_exploration> inv_dot_uses;
    @OWLObjectProperty(iri = Vocabulary.s_p_has_subdataset)
    protected Set<dataset> has_subdataset;
    @OWLObjectProperty(iri = Vocabulary.s_p_inv_dot_offers_dataset)
    protected Set<dataset_source> inv_dot_offers_dataset;
    @OWLObjectProperty(iri = Vocabulary.s_p_inv_dot_constitutes)
    protected Set<dataset_snapshot> inv_dot_constitutes;
    @OWLObjectProperty(iri = Vocabulary.s_p_inv_dot_has_dataset_explorer)
    protected Set<dataset_exploration> inv_dot_has_dataset_explorer;
    @OWLObjectProperty(iri = Vocabulary.s_p_inv_dot_has_subdataset)
    protected Set<dataset> inv_dot_has_subdataset;
    @OWLObjectProperty(iri = Vocabulary.s_p_inv_dot_describes)
    protected Set<dataset_descriptor> inv_dot_describes;
    @OWLObjectProperty(iri = Vocabulary.s_p_inv_dot_is_created_by)
    protected Set<execution_context_dataset_source> inv_dot_is_created_by;
    @OWLObjectProperty(iri = Vocabulary.s_p_has_source)
    protected Set<source_dataset_snapshot> has_source;
    @OWLObjectProperty(iri = Vocabulary.s_p_inv_dot_has_intent)
    protected Set<dataset_exploring_journalist> inv_dot_has_intent;
    @OWLObjectProperty(iri = Vocabulary.s_p_inv_dot_is_part_of)
    protected Set<data> inv_dot_is_part_of;
    @OWLObjectProperty(iri = Vocabulary.s_p_has_dataset)
    protected Set<dataset> has_dataset;
    @OWLObjectProperty(iri = Vocabulary.s_p_has_dataset_explorer)
    protected Set<dataset_exploring_journalist> has_dataset_explorer;
    @OWLObjectProperty(iri = Vocabulary.s_p_describes)
    protected Set<described_data_artifact> describes;
    @OWLObjectProperty(iri = Vocabulary.s_p_inv_dot_has_explored_dataset)
    protected Set<dataset_exploration> inv_dot_has_explored_dataset;
    @OWLObjectProperty(iri = Vocabulary.s_p_inv_dot_has_dataset_descriptor)
    protected Set<cz.cvut.kbss.ddo.model.description> inv_dot_has_dataset_descriptor;
    @OWLObjectProperty(iri = Vocabulary.s_p_inv_dot_has_member)
    protected Set<data> inv_dot_has_member;
    @OWLObjectProperty(iri = Vocabulary.s_p_inv_dot_has_target)
    protected Set<transformation> inv_dot_has_target;
    @OWLObjectProperty(iri = Vocabulary.s_p_has_intent)
    protected Set<intent> has_intent;
    @OWLObjectProperty(iri = Vocabulary.s_p_inv_dot_has_published_dataset_snapshot)
    protected Set<dataset_publication> inv_dot_has_published_dataset_snapshot;
    @OWLObjectProperty(iri = Vocabulary.s_p_constitutes)
    protected Set<data> constitutes;
    @OWLObjectProperty(iri = Vocabulary.s_p_has_explored_dataset)
    protected Set<dataset> has_explored_dataset;
    @OWLObjectProperty(iri = Vocabulary.s_p_inv_dot_has_item)
    protected Set<single_item_selector> inv_dot_has_item;
    @OWLObjectProperty(iri = Vocabulary.s_p_has_publisher)
    protected Set<publisher> has_publisher;
    @OWLObjectProperty(iri = Vocabulary.s_p_offers_dataset)
    protected Set<dataset> offers_dataset;
    @OWLObjectProperty(iri = Vocabulary.s_p_inv_dot_is_description_of)
    protected Set<cz.cvut.kbss.ddo.model.description> inv_dot_is_description_of;
    @OWLObjectProperty(iri = Vocabulary.s_p_uses)
    protected Set<intent> uses;
    @OWLObjectProperty(iri = Vocabulary.s_p_has_published_dataset_snapshot)
    protected Set<dataset_snapshot> has_published_dataset_snapshot;
    @OWLObjectProperty(iri = Vocabulary.s_p_inv_dot_has_source)
    protected Set<dataset_publication> inv_dot_has_source;
    @OWLObjectProperty(iri = Vocabulary.s_p_inv_dot_has_sub_dataset_snapshot)
    protected Set<dataset_snapshot> inv_dot_has_sub_dataset_snapshot;
    @OWLObjectProperty(iri = Vocabulary.s_p_has_sub_dataset_snapshot)
    protected Set<dataset_snapshot> has_sub_dataset_snapshot;
    @OWLObjectProperty(iri = Vocabulary.s_p_inv_dot_has_dataset)
    protected Set<dataset_snapshot> inv_dot_has_dataset;
    @OWLObjectProperty(iri = Vocabulary.s_p_is_part_of)
    protected Set<data> is_part_of;
    @OWLObjectProperty(iri = Vocabulary.s_p_is_description_of)
    protected Set<described_data_artifact> is_description_of;

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

    public void setHas_target(Set<target_dataset_snapshot> has_target) {
        this.has_target = has_target;
    }

    public Set<target_dataset_snapshot> getHas_target() {
        return has_target;
    }

    public void setInv_dot_has_publisher(Set<dataset_publication> inv_dot_has_publisher) {
        this.inv_dot_has_publisher = inv_dot_has_publisher;
    }

    public Set<dataset_publication> getInv_dot_has_publisher() {
        return inv_dot_has_publisher;
    }

    public void setHas_item(Set<data_item> has_item) {
        this.has_item = has_item;
    }

    public Set<data_item> getHas_item() {
        return has_item;
    }

    public void setIs_created_by(Set<transformation> is_created_by) {
        this.is_created_by = is_created_by;
    }

    public Set<transformation> getIs_created_by() {
        return is_created_by;
    }

    public void setHas_member(Set<data_item> has_member) {
        this.has_member = has_member;
    }

    public Set<data_item> getHas_member() {
        return has_member;
    }

    public void setHas_dataset_descriptor(Set<dataset_descriptor> has_dataset_descriptor) {
        this.has_dataset_descriptor = has_dataset_descriptor;
    }

    public Set<dataset_descriptor> getHas_dataset_descriptor() {
        return has_dataset_descriptor;
    }

    public void setInv_dot_uses(Set<dataset_exploration> inv_dot_uses) {
        this.inv_dot_uses = inv_dot_uses;
    }

    public Set<dataset_exploration> getInv_dot_uses() {
        return inv_dot_uses;
    }

    public void setHas_subdataset(Set<dataset> has_subdataset) {
        this.has_subdataset = has_subdataset;
    }

    public Set<dataset> getHas_subdataset() {
        return has_subdataset;
    }

    public void setInv_dot_offers_dataset(Set<dataset_source> inv_dot_offers_dataset) {
        this.inv_dot_offers_dataset = inv_dot_offers_dataset;
    }

    public Set<dataset_source> getInv_dot_offers_dataset() {
        return inv_dot_offers_dataset;
    }

    public void setInv_dot_constitutes(Set<dataset_snapshot> inv_dot_constitutes) {
        this.inv_dot_constitutes = inv_dot_constitutes;
    }

    public Set<dataset_snapshot> getInv_dot_constitutes() {
        return inv_dot_constitutes;
    }

    public void setInv_dot_has_dataset_explorer(Set<dataset_exploration> inv_dot_has_dataset_explorer) {
        this.inv_dot_has_dataset_explorer = inv_dot_has_dataset_explorer;
    }

    public Set<dataset_exploration> getInv_dot_has_dataset_explorer() {
        return inv_dot_has_dataset_explorer;
    }

    public void setInv_dot_has_subdataset(Set<dataset> inv_dot_has_subdataset) {
        this.inv_dot_has_subdataset = inv_dot_has_subdataset;
    }

    public Set<dataset> getInv_dot_has_subdataset() {
        return inv_dot_has_subdataset;
    }

    public void setInv_dot_describes(Set<dataset_descriptor> inv_dot_describes) {
        this.inv_dot_describes = inv_dot_describes;
    }

    public Set<dataset_descriptor> getInv_dot_describes() {
        return inv_dot_describes;
    }

    public void setInv_dot_is_created_by(Set<execution_context_dataset_source> inv_dot_is_created_by) {
        this.inv_dot_is_created_by = inv_dot_is_created_by;
    }

    public Set<execution_context_dataset_source> getInv_dot_is_created_by() {
        return inv_dot_is_created_by;
    }

    public void setHas_source(Set<source_dataset_snapshot> has_source) {
        this.has_source = has_source;
    }

    public Set<source_dataset_snapshot> getHas_source() {
        return has_source;
    }

    public void setInv_dot_has_intent(Set<dataset_exploring_journalist> inv_dot_has_intent) {
        this.inv_dot_has_intent = inv_dot_has_intent;
    }

    public Set<dataset_exploring_journalist> getInv_dot_has_intent() {
        return inv_dot_has_intent;
    }

    public void setInv_dot_is_part_of(Set<data> inv_dot_is_part_of) {
        this.inv_dot_is_part_of = inv_dot_is_part_of;
    }

    public Set<data> getInv_dot_is_part_of() {
        return inv_dot_is_part_of;
    }

    public void setHas_dataset(Set<dataset> has_dataset) {
        this.has_dataset = has_dataset;
    }

    public Set<dataset> getHas_dataset() {
        return has_dataset;
    }

    public void setHas_dataset_explorer(Set<dataset_exploring_journalist> has_dataset_explorer) {
        this.has_dataset_explorer = has_dataset_explorer;
    }

    public Set<dataset_exploring_journalist> getHas_dataset_explorer() {
        return has_dataset_explorer;
    }

    public void setDescribes(Set<described_data_artifact> describes) {
        this.describes = describes;
    }

    public Set<described_data_artifact> getDescribes() {
        return describes;
    }

    public void setInv_dot_has_explored_dataset(Set<dataset_exploration> inv_dot_has_explored_dataset) {
        this.inv_dot_has_explored_dataset = inv_dot_has_explored_dataset;
    }

    public Set<dataset_exploration> getInv_dot_has_explored_dataset() {
        return inv_dot_has_explored_dataset;
    }

    public void setInv_dot_has_dataset_descriptor(Set<cz.cvut.kbss.ddo.model.description> inv_dot_has_dataset_descriptor) {
        this.inv_dot_has_dataset_descriptor = inv_dot_has_dataset_descriptor;
    }

    public Set<cz.cvut.kbss.ddo.model.description> getInv_dot_has_dataset_descriptor() {
        return inv_dot_has_dataset_descriptor;
    }

    public void setInv_dot_has_member(Set<data> inv_dot_has_member) {
        this.inv_dot_has_member = inv_dot_has_member;
    }

    public Set<data> getInv_dot_has_member() {
        return inv_dot_has_member;
    }

    public void setInv_dot_has_target(Set<transformation> inv_dot_has_target) {
        this.inv_dot_has_target = inv_dot_has_target;
    }

    public Set<transformation> getInv_dot_has_target() {
        return inv_dot_has_target;
    }

    public void setHas_intent(Set<intent> has_intent) {
        this.has_intent = has_intent;
    }

    public Set<intent> getHas_intent() {
        return has_intent;
    }

    public void setInv_dot_has_published_dataset_snapshot(Set<dataset_publication> inv_dot_has_published_dataset_snapshot) {
        this.inv_dot_has_published_dataset_snapshot = inv_dot_has_published_dataset_snapshot;
    }

    public Set<dataset_publication> getInv_dot_has_published_dataset_snapshot() {
        return inv_dot_has_published_dataset_snapshot;
    }

    public void setConstitutes(Set<data> constitutes) {
        this.constitutes = constitutes;
    }

    public Set<data> getConstitutes() {
        return constitutes;
    }

    public void setHas_explored_dataset(Set<dataset> has_explored_dataset) {
        this.has_explored_dataset = has_explored_dataset;
    }

    public Set<dataset> getHas_explored_dataset() {
        return has_explored_dataset;
    }

    public void setInv_dot_has_item(Set<single_item_selector> inv_dot_has_item) {
        this.inv_dot_has_item = inv_dot_has_item;
    }

    public Set<single_item_selector> getInv_dot_has_item() {
        return inv_dot_has_item;
    }

    public void setHas_publisher(Set<publisher> has_publisher) {
        this.has_publisher = has_publisher;
    }

    public Set<publisher> getHas_publisher() {
        return has_publisher;
    }

    public void setOffers_dataset(Set<dataset> offers_dataset) {
        this.offers_dataset = offers_dataset;
    }

    public Set<dataset> getOffers_dataset() {
        return offers_dataset;
    }

    public void setInv_dot_is_description_of(Set<cz.cvut.kbss.ddo.model.description> inv_dot_is_description_of) {
        this.inv_dot_is_description_of = inv_dot_is_description_of;
    }

    public Set<cz.cvut.kbss.ddo.model.description> getInv_dot_is_description_of() {
        return inv_dot_is_description_of;
    }

    public void setUses(Set<intent> uses) {
        this.uses = uses;
    }

    public Set<intent> getUses() {
        return uses;
    }

    public void setHas_published_dataset_snapshot(Set<dataset_snapshot> has_published_dataset_snapshot) {
        this.has_published_dataset_snapshot = has_published_dataset_snapshot;
    }

    public Set<dataset_snapshot> getHas_published_dataset_snapshot() {
        return has_published_dataset_snapshot;
    }

    public void setInv_dot_has_source(Set<dataset_publication> inv_dot_has_source) {
        this.inv_dot_has_source = inv_dot_has_source;
    }

    public Set<dataset_publication> getInv_dot_has_source() {
        return inv_dot_has_source;
    }

    public void setInv_dot_has_sub_dataset_snapshot(Set<dataset_snapshot> inv_dot_has_sub_dataset_snapshot) {
        this.inv_dot_has_sub_dataset_snapshot = inv_dot_has_sub_dataset_snapshot;
    }

    public Set<dataset_snapshot> getInv_dot_has_sub_dataset_snapshot() {
        return inv_dot_has_sub_dataset_snapshot;
    }

    public void setHas_sub_dataset_snapshot(Set<dataset_snapshot> has_sub_dataset_snapshot) {
        this.has_sub_dataset_snapshot = has_sub_dataset_snapshot;
    }

    public Set<dataset_snapshot> getHas_sub_dataset_snapshot() {
        return has_sub_dataset_snapshot;
    }

    public void setInv_dot_has_dataset(Set<dataset_snapshot> inv_dot_has_dataset) {
        this.inv_dot_has_dataset = inv_dot_has_dataset;
    }

    public Set<dataset_snapshot> getInv_dot_has_dataset() {
        return inv_dot_has_dataset;
    }

    public void setIs_part_of(Set<data> is_part_of) {
        this.is_part_of = is_part_of;
    }

    public Set<data> getIs_part_of() {
        return is_part_of;
    }

    public void setIs_description_of(Set<described_data_artifact> is_description_of) {
        this.is_description_of = is_description_of;
    }

    public Set<described_data_artifact> getIs_description_of() {
        return is_description_of;
    }

}

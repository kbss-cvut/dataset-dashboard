package cz.cvut.kbss.datasetdashboard.model.util;

import cz.cvut.kbss.ddo.Vocabulary;
import cz.cvut.kbss.ddo.model.dataset_source;

import static cz.cvut.kbss.datasetdashboard.model.util.ModelHelper.getSingleProperty;
import static cz.cvut.kbss.datasetdashboard.model.util.ModelHelper.isOfType;

public class DatasetSourceHelper {

    public static String getHashCode(final dataset_source ds) {
        if (isOfType(ds, Vocabulary.s_c_named_graph_sparql_endpoint_dataset_source)) {
            return (getSingleProperty(ds, Vocabulary.s_p_has_endpoint_url)
                                          + getSingleProperty(ds,
                Vocabulary.s_p_has_graph_id)).hashCode()+"";
        } else if (isOfType(ds, Vocabulary.s_c_sparql_endpoint_dataset_source)) {
            return getSingleProperty(ds,Vocabulary.s_p_has_endpoint_url).hashCode()+"";
        } else {
            throw new IllegalArgumentException("Dataset source of unsupported type " + ds);
        }
    }
}

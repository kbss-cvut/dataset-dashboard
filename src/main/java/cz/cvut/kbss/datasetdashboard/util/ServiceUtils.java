package cz.cvut.kbss.datasetdashboard.util;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import cz.cvut.kbss.datasetdashboard.model.util.ModelHelper;
import cz.cvut.kbss.ddo.Vocabulary;
import cz.cvut.kbss.ddo.model.dataset_descriptor;
import cz.cvut.kbss.ddo.model.dataset_source;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ServiceUtils {

    private static final Logger LOG = LoggerFactory.getLogger(ServiceUtils.class);

    public static JsonObject outputDescriptor(final dataset_descriptor v) {
        final JsonObject ds = new JsonObject();
        ds.addProperty("id", v.getId());
        // TODO move to the backend
        String type;
        v.getTypes().remove(Vocabulary.s_c_dataset_descriptor);
        if (v.getTypes().size() > 0 ) {
            type = v.getTypes().iterator().next();
            ds.addProperty("type", type);
        }
        return ds;
    }

    public static JsonArray outputDescriptors(final List<dataset_descriptor> data) {
        final JsonArray result = new JsonArray();
        data.forEach((v) -> {
            try {
                result.add(outputDescriptor(v));
            } catch (Exception e) {
                LOG.error("Invalid source {}, skipping", v.getId(),e);
            }
        });
        return result;
    }

    /**
     * Returns all registered data sources.
     *
     * @return a list of data sources.
     */
    public static JsonArray outputSources(final List<dataset_source> datasetSources) {
        final JsonArray result = new JsonArray();
        datasetSources.forEach((v) -> {
            try {
                final JsonObject ds = new JsonObject();
                ds.addProperty("id", v.getId());
                if (ModelHelper
                    .isOfType(v, Vocabulary.s_c_named_graph_sparql_endpoint_dataset_source)) {
                    ds.addProperty("type",
                        Vocabulary.s_c_named_graph_sparql_endpoint_dataset_source);
                    ds.addProperty("endpointUrl",
                        v.getProperties().get(Vocabulary.s_p_has_endpoint_url).iterator().next()
                         .toString());
                    ds.addProperty("graphId",
                        v.getProperties().get(Vocabulary.s_p_has_graph_id).iterator().next()
                         .toString());
                } else if (ModelHelper
                    .isOfType(v, Vocabulary.s_c_sparql_endpoint_dataset_source)) {
                    ds.addProperty("type", Vocabulary.s_c_sparql_endpoint_dataset_source);
                    ds.addProperty("endpointUrl",
                        v.getProperties().get(Vocabulary.s_p_has_endpoint_url).iterator().next()
                         .toString());
                } else if (ModelHelper.isOfType(v, Vocabulary.s_c_url_dataset_source)) {
                    ds.addProperty("type", Vocabulary.s_c_url_dataset_source);
                    ds.addProperty("downloadUrl",
                        v.getProperties().get(Vocabulary.s_p_has_download_url).iterator().next()
                         .toString());
                } else {
                    ds.addProperty("type", Vocabulary.s_c_dataset_source);
                }
                result.add(ds);
            } catch (Exception e) {
                LOG.error("Invalid source " + v.getId() + " , skipping",e);
            }
        });
        return result;
    }
}

package cz.cvut.kbss.datasetdashboard.util;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import cz.cvut.kbss.ddo.Vocabulary;
import cz.cvut.kbss.ddo.model.dataset_descriptor;
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
                LOG.error("Invalid source {}, skipping", v.getId());
            }
        });
        return result;
    }
}

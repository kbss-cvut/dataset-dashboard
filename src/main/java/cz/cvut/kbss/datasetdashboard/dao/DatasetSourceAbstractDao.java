package cz.cvut.kbss.datasetdashboard.dao;

import cz.cvut.kbss.ddo.model.dataset_source;
import java.util.List;
import org.springframework.context.annotation.PropertySource;

@PropertySource("classpath:config.properties")
public abstract class DatasetSourceAbstractDao extends BaseDao<dataset_source> {

    protected DatasetSourceAbstractDao() {
        super(dataset_source.class);
    }

    public abstract List<dataset_source> getAll();
}

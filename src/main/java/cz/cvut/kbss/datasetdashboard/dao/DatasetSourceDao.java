package cz.cvut.kbss.datasetdashboard.dao;

import com.google.gson.JsonObject;
import cz.cvut.kbss.datasetdashboard.dao.util.JopaHelper;
import cz.cvut.kbss.datasetdashboard.model.util.EntityToOwlClassMapper;
import cz.cvut.kbss.ddo.Vocabulary;
import cz.cvut.kbss.ddo.model.dataset;
import cz.cvut.kbss.ddo.model.dataset_descriptor;
import cz.cvut.kbss.ddo.model.dataset_source;
import cz.cvut.kbss.ddo.model.named_graph_sparql_endpoint_dataset_source;
import cz.cvut.kbss.ddo.model.sparql_endpoint_dataset_source;
import cz.cvut.kbss.jopa.model.EntityManager;
import cz.cvut.kbss.jopa.model.descriptors.EntityDescriptor;
import java.net.URI;
import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Repository;

@Repository
@PropertySource("classpath:config.properties")
public class DatasetSourceDao extends BaseDao<dataset_source> {

    @Autowired
    private SparqlAccessor sparqlAccessor;

    @Autowired
    private EntityManager em;

    public DatasetSourceDao() {
        super(dataset_source.class);
    }

    private String getStringValue(final JsonObject o, final String parameter) {
        return o.get(parameter).getAsJsonObject().get("value").getAsString();
    }

    /**
     * Get all named graphs in the SPARQL endpoint.
     *
     * @param sparqlEndpointUrl URL of the SPARQL endpoint.
     * @return IRIs of all named graphs.
     */
    public List<String> getAllNamedGraphsInEndpoint(final String sparqlEndpointUrl) {
        List<String> all = new ArrayList<>();
        sparqlAccessor.getSparqlSelectResult("query/get_sparql_endpoint_named_graph_datasetsources.rq",
            sparqlEndpointUrl).forEach((e) -> {
                final String graph = getStringValue(e.getAsJsonObject(), "graph");
                all.add(graph);
            }
        );
        return all;
    }

    /**
     * Get all dataset sources.
     *
     * @return all registered dataset sources.
     */
    public List<dataset_source> getAll() {
        final List l = em.createNativeQuery("PREFIX ddo: <http://onto.fel.cvut"
                                            + ".cz/ontologies/dataset-descriptor/> SELECT DISTINCT "
                                            + "" + "?x ?endpoint ?graphId WHERE { "
                                            + "?x ddo:has-endpoint-url ?endpoint . "
                                            + "OPTIONAL {?x ddo:has-graph-id " + "?graphId}}")
//                         .setParameter("type", typeUri)
                         .getResultList();
        final List<dataset_source> datasetSources = new ArrayList<>();
        l.forEach((result) -> {
            final Object[] record = (Object[]) result;
            final dataset_source ds;
            final Map<String, Set<String>> map = new HashMap<>();
            if (record.length > 2 && record[2] != null) {
                ds = new named_graph_sparql_endpoint_dataset_source();
                map.put(Vocabulary.s_p_has_graph_id, Collections.singleton(record[2].toString()));
            } else {
                ds = new sparql_endpoint_dataset_source();
            }
            ds.setId(record[0].toString());
            map.put(Vocabulary.s_p_has_endpoint_url, Collections.singleton(record[1].toString()));
            ds.setProperties(map);
            datasetSources.add(ds);
        });
        return datasetSources;
    }


    /**
     * Registers a dataset source defined by an URL.
     *
     * @param url to store as a dataset source
     * @return an identifier of the registered dataset source.
     */
    public dataset_source register(final String url) {
        int id = url.hashCode();
        dataset_source ds = em.find(dataset_source.class, id + "");

        if (ds == null) {
            final dataset dataset = JopaHelper.create(dataset.class,id+"");
            ds = JopaHelper.create(dataset_source.class,id + "");
            ds.getTypes().add(Vocabulary.s_c_url_dataset_source);
            ds.getProperties().put(Vocabulary.s_p_has_download_url, Collections.singleton(url));
            ds.setOffers_dataset(Collections.singleton(dataset));
            dataset.setInv_dot_offers_dataset(Collections.singleton(ds));
            EntityDescriptor d = new EntityDescriptor(URI.create(
                "http://onto.fel.cvut.cz/ontologies/ddo-metadata/dataset-sources"));
            em.persist(dataset, d);
            em.persist(ds, d);
        } else {
            LOG.warn("The datasource {} has already been registered.", id);
        }
        return ds;
    }

    /**
     * Registers a dataset source by an endpoint URL and a graph IRI.
     *
     * @param endpointUrl URL of the SPARQL endpoint
     * @param graphIri    IRI of the context within the SPARQL endpoint
     * @return an identifier of the registered dataset source
     */
    public dataset_source register(final String endpointUrl, final String graphIri) {
        if (graphIri != null) {
            return registerNamedGraph(endpointUrl, graphIri);
        } else {
            return registerEndpoint(endpointUrl);
        }
    }

    private dataset_source registerNamedGraph(final String endpointUrl, final String graphIri) {
        int id = (endpointUrl + graphIri).hashCode();
        final List<dataset_source> datasetSources = getTypedQuery(
            dataset_source.class,
            "query/check_exists_named_graph_in_endpoint.rq",
            endpointUrl, URI.create(endpointUrl),
            graphIri, URI.create(graphIri));
        dataset_source ds;
        if (datasetSources.isEmpty()) {
            EntityDescriptor d = new EntityDescriptor(URI.create(
                "http://onto.fel.cvut.cz/ontologies/ddo-metadata/dataset-sources"));
            ds = _registerNamedGraphDatasetSource(d, id, endpointUrl, graphIri);
            em.persist(ds, d);
        } else {
            ds = datasetSources.iterator().next();
            LOG.warn("The datasource {} has already been registered.", id);
        }
        return ds;
    }

    private dataset_source initDatasetSource(int id, final EntityDescriptor d) {
        final dataset_source ds = JopaHelper.create(dataset_source.class,id + "");
        final dataset dataset = JopaHelper.create(dataset.class,id+"");
        ds.setOffers_dataset(Collections.singleton(dataset));
        dataset.setInv_dot_offers_dataset(Collections.singleton(ds));
        em.persist(dataset, d);
        return ds;
    }

    private dataset_source _registerNamedGraphDatasetSource(
        final EntityDescriptor d, int id, final String endpointUrl, final String graphIri) {
        dataset_source ds = initDatasetSource(id, d);
        ds.getTypes().add(Vocabulary.s_c_url_dataset_source);
        ds.getProperties().put(Vocabulary.s_p_has_endpoint_url,
            Collections.singleton(endpointUrl));
        ds.getProperties().put(Vocabulary.s_p_has_graph_id, Collections.singleton(graphIri));
        ds.getTypes().add(Vocabulary.s_c_named_graph_sparql_endpoint_dataset_source);
        return ds;
    }

    private dataset_source registerEndpoint(final String endpointUrl) {
        int id = endpointUrl.hashCode();
        final List<dataset_source> datasetSources = getTypedQuery(
                dataset_source.class,
                "query/get_endpoints.rq",
                URI.create(endpointUrl),
                endpointUrl);
        dataset_source ds;
        if (datasetSources.isEmpty()) {
            EntityDescriptor d = new EntityDescriptor(URI.create(
                "http://onto.fel.cvut.cz/ontologies/ddo-metadata/dataset-sources"));
            ds = _registerEndpointDatasetSource(d, id, endpointUrl);
            em.persist(ds, d);
        } else {
            ds = datasetSources.iterator().next();
            LOG.warn("The datasource {} has already been registered.", id);
        }
        return ds;
    }

    private dataset_source _registerEndpointDatasetSource(
        final EntityDescriptor d, int id, final String endpointUrl) {
        dataset_source ds = initDatasetSource(id, d);
        ds.getTypes().add(Vocabulary.s_c_url_dataset_source);
        ds.getProperties()
          .put(Vocabulary.s_p_has_endpoint_url, Collections.singleton(endpointUrl));
        ds.getTypes().add(Vocabulary.s_c_sparql_endpoint_dataset_source);
        final List<String> graphIds = getAllNamedGraphsInEndpoint(endpointUrl);
        for (final String graphId : graphIds) {
            registerNamedGraph(endpointUrl, graphId);
        }
        return ds;
    }

    /**
     * Retrieves the last descriptor of given type for the given dataset source id.
     *
     * @param datasetSourceId id of the dataset source
     * @param descriptorType  IRI of the class of the descriptor
     * @return content of the descriptor
     */
    public List<dataset_descriptor> getDescriptors(final String datasetSourceId,
                                                   final String descriptorType) {
        return getTypedQuery(
            dataset_descriptor.class,
            "query/get_descriptors_for_dataset_source.rq",
            URI.create(datasetSourceId),
            URI.create(descriptorType));
    }

    /**
     * Executes given SPARQL Construct query against a dataset source. Efficiently, a new dataset
     * snapshot is created and queried by the user supplied query
     *
     * @param queryFile of the SPARQL query to execute
     * @return a {@link String} object containing turtle-formatted result.
     *
     * @throws IllegalArgumentException When the specified queryName is not known
     */
    public String getSparqlConstructResult(dataset_source ds, final String queryFile,
                                           final Map<String, String> bindings) {
        final dataset_source datasetSource = this.find(URI.create(ds.getId()));

        if (EntityToOwlClassMapper
            .isOfType(datasetSource, Vocabulary.s_c_named_graph_sparql_endpoint_dataset_source)) {
            final String endpointUrl = getSingleProperty(datasetSource,Vocabulary.s_p_has_endpoint_url);
            final String graphIri = getSingleProperty(datasetSource,Vocabulary.s_p_has_graph_id);
            return sparqlAccessor
                .getSparqlResult(queryFile, bindings, endpointUrl, graphIri, "text/turtle");
        } else if (EntityToOwlClassMapper
            .isOfType(datasetSource, Vocabulary.s_c_sparql_endpoint_dataset_source)) {
            final String endpointUrl = getSingleProperty(datasetSource,Vocabulary.s_p_has_endpoint_url);
            return sparqlAccessor
                .getSparqlResult(queryFile, bindings, endpointUrl, null, "text/turtle");
        } else {
            throw new IllegalStateException(MessageFormat.format(
                "The dataset source of types {} is not recognized.", datasetSource.getTypes()));
        }
    }
}

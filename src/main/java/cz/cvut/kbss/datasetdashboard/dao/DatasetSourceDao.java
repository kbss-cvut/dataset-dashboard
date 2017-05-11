package cz.cvut.kbss.datasetdashboard.dao;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import cz.cvut.kbss.datasetdashboard.exception.WebServiceIntegrationException;
import cz.cvut.kbss.datasetdashboard.model.util.EntityToOwlClassMapper;
import cz.cvut.kbss.datasetdashboard.service.data.DataLoader;
import cz.cvut.kbss.datasetdashboard.util.Constants;
import cz.cvut.kbss.ddo.Vocabulary;
import cz.cvut.kbss.ddo.model.dataset;
import cz.cvut.kbss.ddo.model.dataset_descriptor;
import cz.cvut.kbss.ddo.model.dataset_source;
import cz.cvut.kbss.ddo.model.spo_summary_descriptor;
import cz.cvut.kbss.jopa.model.EntityManager;
import cz.cvut.kbss.jopa.transactions.EntityTransaction;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URLEncoder;
import java.text.MessageFormat;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import javax.annotation.PostConstruct;
import org.apache.jena.query.Query;
import org.apache.jena.query.QueryFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Repository;

@Repository
@PropertySource("classpath:config.properties")
public class DatasetSourceDao extends DatasetSourceAbstractDao {

    private Logger logger = LoggerFactory.getLogger(DatasetSourceDao.class);

    @Autowired
    @Qualifier("remoteDataLoader")
    private DataLoader remoteLoader;

    @Autowired
    @Qualifier("localDataLoader")
    private DataLoader localLoader;

    @Autowired
    private Environment environment;

    @PostConstruct
    public void init() {
        for (final String ckanEndpoint : environment.getProperty("ckan.jackan.sparqlEndpoints").split(",")) {
            if (!ckanEndpoint.isEmpty()) {
                loadCkanDatasetSources(ckanEndpoint);
            }
        }
    }

    private String getStringValue(final JsonObject o, final String parameter) {
        return o.get(parameter).getAsJsonObject().get("value").getAsString();
    }

    private JsonArray getSparqlSelectResult(final String queryName,
                                            final String sparqlEndpointUrl) {
        final JsonParser jsonParser = new JsonParser();
        String result = getSparqlResult(queryName,
            sparqlEndpointUrl, null, "application/json");
        if (result != null) {
            final JsonElement jsonResult = jsonParser.parse(result);
            return jsonResult.getAsJsonObject()
                .get("results").getAsJsonObject()
                .get("bindings").getAsJsonArray();
        } else {
            return new JsonArray();
        }
    }

    private void loadCkanDatasetSources(final String sparqlEndpointUrl) {
        try {
            getSparqlSelectResult("query/get_ckan_datasetsources.rq", sparqlEndpointUrl)
                .forEach((e) -> {
                    final String type = getStringValue(e.getAsJsonObject(), "type");
                    final String url = getStringValue(e.getAsJsonObject(), "url");

                    if (Vocabulary.s_c_sparql_endpoint_dataset_source.equals(type)) {
                        register(url, null);
                        loadAllNamedGraphsFromEndpoint(url);
                    } else if (Vocabulary.s_c_url_dataset_source.equals(type)) {
                        register(url, null);
                    }
                });
        } catch (final Exception e) {
            logger.info("Unable to fetch dataset sources from {}", sparqlEndpointUrl, e);
        }
    }

    private void loadAllNamedGraphsFromEndpoint(final String sparqlEndpointUrl) {
        getSparqlSelectResult("query/get_sparql_endpoint_named_graph_datasetsources.rq",
            sparqlEndpointUrl).forEach((e) -> {
                final String graph = getStringValue(e.getAsJsonObject(), "graph");
                register(sparqlEndpointUrl, graph);
            }
        );
    }

    /**
     * Executes given named SPARQL query
     *
     * @param queryFile of the SPARQL query
     * @return a {@link String} object containing JSON-formatted SPARQL Select result.
     *
     * @throws IllegalArgumentException When the specified queryName is not known
     */
    public String getSparqlResult(final String queryFile,
                                  final String repositoryUrl,
                                  final String graphIri,
                                  final String mediaType) {
        return getSparqlResult(queryFile,repositoryUrl,graphIri,mediaType,entityManager());
    }

    private String getSparqlResult(final String queryFile,
        final String repositoryUrl,
        final String graphIri,
        final String mediaType,
        final EntityManager em) {
        if (repositoryUrl.isEmpty()) {
            throw new IllegalStateException("Missing repository URL configuration.");
        }
        String query = localLoader.loadData(queryFile, Collections.emptyMap());
        try {
            if (graphIri != null) {
                final Query q = QueryFactory.create(query);
                q.addGraphURI(graphIri);
                query = q.toString();
            }
            query = URLEncoder.encode(query, Constants.UTF_8_ENCODING);
            final Map<String, String> params = new HashMap<>();
            params.put("query", query);
            if (mediaType != null) {
                params.put(HttpHeaders.ACCEPT, mediaType);
            }
            return remoteLoader.loadData(repositoryUrl, params);
        } catch (WebServiceIntegrationException e) {
            logger.warn("Error during query execution {} to endpoint {} and graphIri {}", queryFile, repositoryUrl, graphIri);
            return null;
        } catch (UnsupportedEncodingException e) {
            throw new IllegalStateException("Unable to find encoding "
                + Constants.UTF_8_ENCODING, e);
        }
    }

    @Override
    public List<dataset_source> getAll() {
        final EntityManager em = entityManager();
        final List<dataset_source> datasetSources = findAll(em);
        datasetSources.forEach((ds) -> {
            ds.getProperties();
        });
        return datasetSources;
    }

    private dataset_source createDatasetSource(int id) {
        final dataset_source datasetSource = new dataset_source();
        datasetSource.setId(Vocabulary.s_c_dataset_source + "-" + id);
        final Set<String> types = new HashSet<>();
        types.add(Vocabulary.s_c_dataset_source);
        datasetSource.setTypes(types);
        final Map<String, Set<String>> properties = new HashMap<>();
        datasetSource.setProperties(properties);
        return datasetSource;
    }

    private dataset createDataset(int id) {
        final dataset dataset = new dataset();
        dataset.setId(Vocabulary.s_c_dataset + "-" + id);
        final Set<String> types = new HashSet<>();
        types.add(Vocabulary.s_c_dataset);
        dataset.setTypes(types);
        final Map<String, Set<String>> properties = new HashMap<>();
        dataset.setProperties(properties);
        return dataset;
    }

    /**
     * Registers a dataset source defined by an URL.
     *
     * @param url to store as a dataset source
     * @return an identifier of the registered dataset source.
     */
    public int register(final String url) {
        EntityManager e = entityManager();
        int id = url.hashCode();
        dataset_source ds = e.find(dataset_source.class, Vocabulary.s_c_dataset_source + "-" + id);

        if (ds == null) {
            dataset dataset = createDataset(id);
            ds = createDatasetSource(id);
            ds.getTypes().add(Vocabulary.s_c_url_dataset_source);
            ds.getProperties().put(Vocabulary.s_p_has_download_url, Collections.singleton(url));
            ds.setOffers_dataset(Collections.singleton(dataset));
            final EntityTransaction t = e.getTransaction();
            t.begin();
            e.persist(dataset);
            e.persist(ds);
            t.commit();
        } else {
            LOG.warn("The datasource {} has already been registered.", id);
        }
        return id;
    }

    /**
     * Registers a dataset source by an endpoint URL and a graph IRI.
     *
     * @param endpointUrl URL of the SPARQL endpoint
     * @param graphIri    IRI of the context within the SPARQL endpoint
     * @return an identifier of the registered dataset source
     */
    public int register(final String endpointUrl, final String graphIri) {
        EntityManager e = entityManager();
        int id = (endpointUrl + graphIri).hashCode();
        dataset_source ds = e.find(dataset_source.class, Vocabulary.s_c_dataset_source + "-" + id);
        if (ds == null) {
            dataset dataset = createDataset(id);
            ds = createDatasetSource(id);
            ds.getProperties().put(Vocabulary.s_p_has_endpoint_url, Collections.singleton(endpointUrl));
            ds.getTypes().add(Vocabulary.s_c_url_dataset_source);
            if (graphIri != null) {
                ds.getProperties().put(Vocabulary.s_p_has_graph_id, Collections.singleton(graphIri));
                ds.getTypes().add(Vocabulary.s_c_named_graph_sparql_endpoint_dataset_source);
                register(endpointUrl, null);
                // ds.getProperties().put(Vocabulary.s_p_has_, Collections.singleton(graphIri));
            } else {
                ds.getTypes().add(Vocabulary.s_c_sparql_endpoint_dataset_source);
            }
            ds.setOffers_dataset(Collections.singleton(dataset));
            final EntityTransaction t = e.getTransaction();
            t.begin();
            e.persist(dataset);
            e.persist(ds);
            t.commit();
        } else {
            LOG.warn("The datasource {} has already been registered.", id);
        }
        return id;
    }

    /**
     * Executes given SPARQL Construct query against a dataset source. Efficiently, a new dataset
     * snapshot is created and queried by the user supplied query
     *
     * @param queryFile of the SPARQL query to execute
     * @return a {@link String} object containing JSONLD-formatted result.
     *
     * @throws IllegalArgumentException When the specified queryName is not known
     */
    public String getSparqlConstructResult(final String queryFile, final String datasetSourceId) {
        final EntityManager em = entityManager();
        try {
            final URI datasetSourceIri = URI.create(Vocabulary.s_c_dataset_source + "-" + datasetSourceId);
            Objects.requireNonNull(datasetSourceIri);
            dataset_source datasetSource = findByUri(datasetSourceIri, em);
            return getSparqlConstructResult(datasetSource, queryFile, em);
        } catch (Exception e) {
            logger.error("Fetching data failed for queryFile {} and datasetSourceId {}",
                queryFile, datasetSourceId, e);
            return null;
        } finally {
            em.close();
        }
    }

    private String getSparqlConstructResult(final dataset_source datasetSource, final String queryFile, final EntityManager em) {
        if (EntityToOwlClassMapper.isOfType(datasetSource,
            Vocabulary.s_c_named_graph_sparql_endpoint_dataset_source)) {
            final String endpointUrl = datasetSource.getProperties()
                .get(Vocabulary.s_p_has_endpoint_url).iterator().next();
            final String graphIri = datasetSource.getProperties()
                .get(Vocabulary.s_p_has_graph_id).iterator().next();
            return getSparqlResult(queryFile, endpointUrl,
                graphIri, "text/turtle",em);
        } else if (EntityToOwlClassMapper.isOfType(datasetSource,Vocabulary.s_c_sparql_endpoint_dataset_source)) {
            final String endpointUrl = datasetSource.getProperties()
                .get(Vocabulary.s_p_has_endpoint_url).iterator().next();
            return getSparqlResult(queryFile, endpointUrl,
                null, "text/turtle", em);
        } else {
            throw new IllegalStateException(MessageFormat.format(
                "The dataset source of types {} is not recognized.",
                datasetSource.getTypes()));
        }
    }

    /**
     * Retrieves the last descriptor of given type for the given dataset source id.
     *
     * @param datasetSourceIri iri of the dataset source
     * @param descriptorType   IRI of the class of the descriptor
     * @return content of the descriptor
     */
    private List<dataset_descriptor> getDescriptors(final String datasetSourceIri, final String descriptorType, final EntityManager em) {
        List<dataset_descriptor> result = em.createNativeQuery(
            "SELECT DISTINCT ?datasetDescriptor { ?vocDescriptionInstance a ?vocDescription ; ?vocHasSource ?datasetSource . ?datasetDescriptor ?vocInvHasDatasetDescriptor ?vocDescriptionInstance. ?datasetDescriptor a ?datasetDescriptorType }",
            dataset_descriptor.class
        )
            .setParameter("vocDescription", URI.create(Vocabulary.s_c_description))
            .setParameter("vocHasSource", URI.create(Vocabulary.s_p_has_source))
            .setParameter("vocInvHasDatasetDescriptor", URI.create(Vocabulary.s_p_inv_dot_has_dataset_descriptor))
            .setParameter("datasetSource", URI.create(datasetSourceIri))
            .setParameter("datasetDescriptorType", URI.create(descriptorType)).getResultList();
        result.forEach((r) -> {
            r.getTypes();
            r.getProperties();
        });
        return result;
    }

    /**
     * Retrieves the last descriptor of given type for the given dataset source id.
     *
     * @param datasetDescriptor iri of the dataset source
     * @return content of the descriptor
     */
    private String getDescriptorContent(final dataset_descriptor datasetDescriptor, final EntityManager em) {
        if (spo_summary_descriptor.class.equals(datasetDescriptor.getClass())
            || (datasetDescriptor.getTypes() != null && datasetDescriptor.getTypes().contains(Vocabulary.ONTOLOGY_IRI_dataset_descriptor + "/s-p-o-summary-descriptor"))
            ) {
            return executeQueryOnDescriptorContent(datasetDescriptor, "query/spo/spo-summary.rq", em);
//            }
        } else {
//            return null;
            return executeQueryOnDescriptorContent(datasetDescriptor, "query/get_full_endpoint.rq", em);
        }
    }

    private dataset_source getSourceForDescriptor(final dataset_descriptor datasetDescriptor, final EntityManager em) {
        final dataset_source datasetSource = em.createNativeQuery(
            "SELECT DISTINCT ?datasetSource { ?publication ?vocHasSource ?datasetSource. }",
            dataset_source.class
        )
            .setParameter("vocHasSource", URI.create(Vocabulary.s_p_has_source))
            .setParameter("publication", URI.create(datasetDescriptor.getInv_dot_has_published_dataset_snapshot().getId()))
            .getSingleResult();
        return datasetSource;
    }

    private String executeQueryOnDescriptorContent(final dataset_descriptor datasetDescriptor, final String queryFile, final EntityManager em) {
        final dataset_source datasetSource = getSourceForDescriptor(datasetDescriptor, em);
        return getSparqlConstructResult(datasetSource, queryFile, em);
    }

    /**
     * Retrieves the last descriptor of given type for the given dataset source id.
     *
     * @param datasetSourceId id of the dataset source
     * @param descriptorType  IRI of the class of the descriptor
     * @return content of the descriptor
     */
    public String getLastDescriptor(final String datasetSourceId, final String descriptorType) {
        final EntityManager em = entityManager();
        final List<dataset_descriptor> datasetDescriptors
            = getDescriptors(Vocabulary.s_c_dataset_source + "-" + datasetSourceId, descriptorType, em);

        if (datasetDescriptors.isEmpty()) {
            return "";
        } else {
            return getDescriptorContent(
                Collections.max(datasetDescriptors, Comparator.comparing(
                    c -> {
                        final Map<String, Set<String>> props
                            = c.getProperties();

                        if (props == null) {
                            return "";
                        }
                        final Set<String> creationDates =
                            props.get(Vocabulary.s_p_has_creation_date);
                        if (creationDates == null || creationDates.isEmpty()) {
                            return "";
                        } else {
                            return creationDates.iterator().next();
                        }
                    })
                ), em
            );
        }

    }
}

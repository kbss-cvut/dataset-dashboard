package cz.cvut.kbss.datasetdashboard.dao;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import cz.cvut.kbss.datasetdashboard.exception.WebServiceIntegrationException;
import cz.cvut.kbss.datasetdashboard.model.util.EntityToOwlClassMapper;
import cz.cvut.kbss.datasetdashboard.rest.dto.model.RawJson;
import cz.cvut.kbss.datasetdashboard.service.data.DataLoader;
import cz.cvut.kbss.datasetdashboard.util.Constants;
import cz.cvut.kbss.ddo.Vocabulary;
import cz.cvut.kbss.ddo.model.dataset;
import cz.cvut.kbss.ddo.model.dataset_descriptor;
import cz.cvut.kbss.ddo.model.dataset_source;
import cz.cvut.kbss.ddo.model.spo_summary_descriptor;
import cz.cvut.kbss.jopa.model.EntityManager;
import cz.cvut.kbss.jopa.model.query.TypedQuery;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Objects;
import java.util.Set;
import java.util.function.Function;
import org.apache.jena.query.Query;
import org.apache.jena.query.QueryFactory;
import static org.apache.jena.riot.web.HttpNames.charset;
import static org.apache.jena.vocabulary.RSS.url;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@PropertySource("classpath:config.properties")
public class DatasetSourceDao extends BaseDao<dataset_source> {

    private Logger logger = LoggerFactory.getLogger(DatasetSourceDao.class);

    @Autowired
    @Qualifier("remoteDataLoader")
    private DataLoader remoteLoader;

    @Autowired
    @Qualifier("localDataLoader")
    private DataLoader localLoader;

    @Autowired
    private EntityManager em;

    public DatasetSourceDao() {
        super(dataset_source.class);
    }

    @Transactional("txManager")
    public JsonArray getSparqlSelectResult(final String queryName,
                                            final String sparqlEndpointUrl) {
        final JsonParser jsonParser = new JsonParser();
        String result = getSparqlResult(queryName, Collections.emptyMap(),
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

    private String getStringValue(final JsonObject o, final String parameter) {
        return o.get(parameter).getAsJsonObject().get("value").getAsString();
    }

    @Transactional("txManager")
    public List<String> getAllNamedGraphsInEndpoint(final String sparqlEndpointUrl) {
        List<String> all = new ArrayList<>();
        getSparqlSelectResult("query/get_sparql_endpoint_named_graph_datasetsources.rq",
            sparqlEndpointUrl).forEach((e) -> {
                final String graph = getStringValue(e.getAsJsonObject(), "graph");
                all.add(graph);
            }
        );
        return all;
    }

    /**
     * Executes given named SPARQL query
     *
     * @param queryFile of the SPARQL query
     * @return a {@link String} object containing JSON-formatted SPARQL Select result.
     *
     * @throws IllegalArgumentException When the specified queryName is not known
     */
    @Transactional("txManager")
    public String getSparqlResult(final String queryFile,
                                  final Map<String,String> bindings,
                                  final String repositoryUrl,
                                  final String graphIri,
                                  final String mediaType) {
        if (repositoryUrl.isEmpty()) {
            throw new IllegalStateException("Missing repository URL configuration.");
        }
        String query = localLoader.loadData(queryFile, Collections.emptyMap());
        try {
//            if (!bindings.isEmpty()) {
//                query = query + " VALUES (";
//                for (final String key : bindings.keySet()) {
//                    query = query + " ?" + key;
//                }
//                query = query + " )";
//
//                query = query + " { (";
//                for (final String key : bindings.keySet()) {
//                    query = query + " <" + bindings.get(key) + ">";
//                }
//                query = query + ") }";
//            }

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
            logger.warn("Error during query execution {} to endpoint {} and graphIri {}, exception {}",
                queryFile, repositoryUrl, graphIri, e);
            return null;
        } catch (UnsupportedEncodingException e) {
            throw new IllegalStateException("Unable to find encoding "
                + Constants.UTF_8_ENCODING, e);
        }
    }

    @Transactional("txManager")
    public List<dataset_source> getAll() {
        final List<dataset_source> datasetSources = findAll();
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
    @Transactional("txManager")
    public int register(final String url) {
        int id = url.hashCode();
        dataset_source ds = em.find(dataset_source.class, Vocabulary.s_c_dataset_source + "-" + id);

        if (ds == null) {
            final dataset dataset = createDataset(id);
            ds = createDatasetSource(id);
            ds.getTypes().add(Vocabulary.s_c_url_dataset_source);
            ds.getProperties().put(Vocabulary.s_p_has_download_url, Collections.singleton(url));
            ds.setOffers_dataset(Collections.singleton(dataset));
            dataset.setInv_dot_offers_dataset(Collections.singleton(ds));
            em.persist(dataset);
            em.persist(ds);
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
    @Transactional("txManager")
    public int register(final String endpointUrl, final String graphIri) {
        int id = (endpointUrl + graphIri).hashCode();
        dataset_source ds = em.find(dataset_source.class, Vocabulary.s_c_dataset_source + "-" + id);
        if (ds == null) {
            final dataset dataset = createDataset(id);
            ds = createDatasetSource(id);
            ds.getProperties().put(Vocabulary.s_p_has_endpoint_url,
                Collections.singleton(endpointUrl));
            ds.getTypes().add(Vocabulary.s_c_url_dataset_source);
            if (graphIri != null) {
                ds.getProperties().put(Vocabulary.s_p_has_graph_id,
                    Collections.singleton(graphIri));
                ds.getTypes().add(Vocabulary.s_c_named_graph_sparql_endpoint_dataset_source);
//                register(endpointUrl, null);
                // ds.getProperties().put(Vocabulary.s_p_has_, Collections.singleton(graphIri));
            } else {
                ds.getTypes().add(Vocabulary.s_c_sparql_endpoint_dataset_source);
                final List<String> graphIds = getAllNamedGraphsInEndpoint(endpointUrl);
                for(final String graphId : graphIds) {
                    register(endpointUrl, graphId);
                }
            }
            ds.setOffers_dataset(Collections.singleton(dataset));
            dataset.setInv_dot_offers_dataset(Collections.singleton(ds));
            em.persist(dataset);
            em.persist(ds);
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
    @Transactional("txManager")
    public String getSparqlConstructResult(
        final String queryFile,
        final String datasetSourceId,
        final Map<String,String> bindings) {
        try {
            final URI datasetSourceIri
                = URI.create(Vocabulary.s_c_dataset_source + "-" + datasetSourceId);
            Objects.requireNonNull(datasetSourceIri);
            dataset_source datasetSource = find(datasetSourceIri);
            return getSparqlConstructResult(datasetSource, queryFile, bindings);
        } catch (Exception e) {
            logger.error("Fetching data failed for queryFile {} and datasetSourceId {}",
                queryFile, datasetSourceId, e);
            return null;
        }
    }

    private String getSparqlConstructResult(final dataset_source datasetSource,
                                            final String queryFile,
                                            final Map<String,String> bindings) {
        if (EntityToOwlClassMapper.isOfType(datasetSource,
            Vocabulary.s_c_named_graph_sparql_endpoint_dataset_source)) {
            final String endpointUrl = datasetSource.getProperties()
                .get(Vocabulary.s_p_has_endpoint_url).iterator().next();
            final String graphIri = datasetSource.getProperties()
                .get(Vocabulary.s_p_has_graph_id).iterator().next();
            return getSparqlResult(queryFile, bindings, endpointUrl,
                graphIri, "text/turtle");
        } else if (EntityToOwlClassMapper
            .isOfType(datasetSource, Vocabulary.s_c_sparql_endpoint_dataset_source)) {
            final String endpointUrl = datasetSource.getProperties()
                .get(Vocabulary.s_p_has_endpoint_url).iterator().next();
            return getSparqlResult(queryFile, bindings, endpointUrl,
                null, "text/turtle");
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
    private List<dataset_descriptor> getDescriptors(final String datasetSourceIri,
                                                    final String descriptorType) {
        TypedQuery q = em.createNativeQuery(
            "SELECT DISTINCT ?datasetDescriptor { ?vocDescriptionInstance a ?vocDescription ; ?vocHasSource ?datasetSource . ?datasetDescriptor ?vocInvHasDatasetDescriptor ?vocDescriptionInstance. ?datasetDescriptor a ?datasetDescriptorType }",
            dataset_descriptor.class
        );

        q = q.setParameter("vocDescription", URI.create(Vocabulary.s_c_description))
            .setParameter("vocHasSource", URI.create(Vocabulary.s_p_has_source))
            .setParameter("vocInvHasDatasetDescriptor",
                URI.create(Vocabulary.s_p_inv_dot_has_dataset_descriptor))
            .setParameter("datasetSource", URI.create(datasetSourceIri));
        if ( descriptorType != null ) {
            q = q.setParameter("datasetDescriptorType", URI.create(descriptorType));
        }
        final List<dataset_descriptor> result = q.getResultList();
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
    private String getDescriptorContent(final dataset_descriptor datasetDescriptor) {
        if (EntityToOwlClassMapper.isOfType(datasetDescriptor,Vocabulary.s_c_spo_summary_descriptor)
            || (datasetDescriptor.getTypes() != null && datasetDescriptor.getTypes()
            .contains(Vocabulary.ONTOLOGY_IRI_dataset_descriptor + "/s-p-o-summary-descriptor"))
            ) {
            return executeQueryOnDescriptorContent(datasetDescriptor,
                "query/spo/spo-summary.rq");
        } else {
            return executeQueryOnDescriptorContent(datasetDescriptor,
                "query/get_full_endpoint.rq");
        }
    }

    private dataset_source getSourceForDescriptor(final dataset_descriptor datasetDescriptor) {
        final dataset_source datasetSource = em.createNativeQuery(
            "SELECT DISTINCT ?datasetSource { ?publication ?vocHasSource ?datasetSource. }",
            dataset_source.class
        )
            .setParameter("vocHasSource", URI.create(Vocabulary.s_p_has_source))
            .setParameter("publication",
                URI.create(datasetDescriptor.getInv_dot_has_published_dataset_snapshot().getId()))
            .getSingleResult();
        return datasetSource;
    }

    private String executeQueryOnDescriptorContent(final dataset_descriptor datasetDescriptor,
                                                   final String queryFile) {
        final dataset_source datasetSource = getSourceForDescriptor(datasetDescriptor);
        return getSparqlConstructResult(datasetSource, queryFile, Collections.emptyMap());
    }


//    /**
//     * Retrieves all descriptors for the given dataset source id.
//     *
//     * @param datasetSourceIri iri of the dataset source
//     * @return content of the descriptor
//     */
//    public List<dataset_descriptor> getDescriptorsForDatasetSource(final String datasetSourceIri) {
//        return getDescriptors(datasetSourceIri, null);
//    }

    /**
     * Retrieves the last descriptor of given type for the given dataset source id.
     *
     * @param datasetSourceId id of the dataset source
     * @param descriptorType  IRI of the class of the descriptor
     * @return content of the descriptor
     */
    @Transactional("txManager")
    public String getLastDescriptor(final String datasetSourceId, final String descriptorType) {
        final List<dataset_descriptor> datasetDescriptors
            = getDescriptors(Vocabulary.s_c_dataset_source + "-" + datasetSourceId,
            descriptorType);

        Function<dataset_descriptor,String> fReturnCreationDate = c -> {
            final Map<String, Set<String>> props = c.getProperties();
            if (props == null) {
                return "";
            }
            final Set<String> creationDates = props.get(Vocabulary.s_p_has_creation_date);
            if (creationDates == null || creationDates.isEmpty()) {
                return "";
            } else {
                return creationDates.iterator().next();
            }
        };

        try {
            final dataset_descriptor lastDescriptorOfGivenType = Collections.max(
                datasetDescriptors,
                Comparator.comparing(fReturnCreationDate));
            return getDescriptorContent(lastDescriptorOfGivenType);
        } catch(NoSuchElementException e) {
            return "";
        }
    }
}

package cz.cvut.kbss.datasetdashboard.dao;

import cz.cvut.kbss.datasetdashboard.dao.data.DataLoader;
import cz.cvut.kbss.datasetdashboard.exception.WebServiceIntegrationException;
import cz.cvut.kbss.datasetdashboard.model.util.EntityToOwlClassMapper;
import cz.cvut.kbss.ddo.Vocabulary;
import cz.cvut.kbss.ddo.model.dataset;
import cz.cvut.kbss.ddo.model.dataset_descriptor;
import cz.cvut.kbss.ddo.model.dataset_publication;
import cz.cvut.kbss.ddo.model.dataset_source;
import cz.cvut.kbss.ddo.model.described_data_artifact;
import cz.cvut.kbss.ddo.model.description;
import cz.cvut.kbss.ddo.model.publisher;
import cz.cvut.kbss.jopa.model.EntityManager;
import cz.cvut.kbss.jopa.model.descriptors.EntityDescriptor;
import java.net.URI;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Repository
@PropertySource("classpath:config.properties")
public class DatasetDescriptorDao extends BaseDao<dataset_descriptor> {

    @Autowired
    @Qualifier("remoteDataLoader")
    private DataLoader remoteLoader;

    @Autowired
    private DatasetSourceDao datasetSourceDao;

    @Autowired
    private EntityManager em;

    @Autowired
    private Environment environment;

    @Autowired
    private RestTemplate restTemplate;

    private static final DateFormat F = new SimpleDateFormat("yyMMddHHmmss");

    public DatasetDescriptorDao() {
        super(dataset_descriptor.class);
    }

    private void setId(final dataset_source ds) {
        if (EntityToOwlClassMapper.isOfType(ds,Vocabulary.s_c_named_graph_sparql_endpoint_dataset_source)) {
            ds.setId(Vocabulary.s_c_dataset_source + "-" + (
                getSingleProperty(ds,Vocabulary.s_p_has_endpoint_url)
                + getSingleProperty(ds,Vocabulary.s_p_has_graph_id)
            ).hashCode());
        } else if (EntityToOwlClassMapper.isOfType(ds,Vocabulary.s_c_sparql_endpoint_dataset_source)) {
            ds.setId(Vocabulary.s_c_dataset_source + "-" + (getSingleProperty(ds,Vocabulary.s_p_has_endpoint_url)
            ).hashCode());
        } else {
            throw new IllegalArgumentException("Dataset source of unsupported type " + ds);
        }
    }

    private description createDescription(final dataset_source indDatasetSource,
                                          final String type) {
        String time = F.format(Calendar.getInstance().getTime());

        dataset indDataset = new dataset();
        indDataset.setInv_dot_offers_dataset(Collections.singleton(indDatasetSource));

        final dataset_descriptor iDescriptor = new dataset_descriptor();
        iDescriptor.setId(Vocabulary.s_c_dataset_descriptor + "-" + time);
        iDescriptor.setHas_dataset(Collections.singleton(indDataset));
        final Set<String> types = new HashSet<>();
        types.add(Vocabulary.s_c_dataset_descriptor);
        types.add(type);
        iDescriptor.setTypes(types);
        final Map<String, Set<String>> properties = new HashMap<>();
        iDescriptor.setProperties(properties);

        final description iDescription = new description();
        iDescription.setId(Vocabulary.s_c_description + "-" + time);
        iDescription.setHas_dataset_descriptor(iDescriptor);
        iDescriptor.setInv_dot_has_dataset_descriptor(iDescription);
        iDescription.setHas_source(Collections.singleton(indDatasetSource));

        indDatasetSource.setOffers_dataset(Collections.singleton(indDataset));

        final described_data_artifact iArtifact = new described_data_artifact();
        iArtifact.setId(Vocabulary.s_c_dataset_snapshot + "-" + time);
        iArtifact.setTypes(Collections.singleton(Vocabulary.s_c_dataset_snapshot));
        iArtifact.setInv_dot_is_description_of(Collections.singleton(iDescription));
        iArtifact.setInv_dot_describes(Collections.singleton(iDescriptor));
        iDescription.setIs_description_of(iArtifact);

        iDescriptor.setDescribes(iArtifact);

        return iDescription;
    }

    private dataset_publication createPublication(final dataset_descriptor descriptor) {
        String time = F.format(Calendar.getInstance().getTime());

        final dataset_publication indPublication = new dataset_publication();
        indPublication.setId(Vocabulary.s_c_dataset_publication + "-" + time);
        indPublication.setHas_published_dataset_snapshot(descriptor);

        final Map<String, Set<String>> datasetSourceProperties = new HashMap<>();
        datasetSourceProperties.put(Vocabulary.s_p_has_endpoint_url,
            Collections.singleton(environment.getProperty("descriptorsEndpoint")));
        datasetSourceProperties
            .put(Vocabulary.s_p_has_graph_id, Collections.singleton(descriptor.getId()));
        final Set<String> datasetSourceTypes = new HashSet<>();
        datasetSourceTypes.add(Vocabulary.s_c_named_graph_sparql_endpoint_dataset_source);
        datasetSourceTypes.add(Vocabulary.s_c_single_snapshot_dataset_source);
        dataset_source indDatasetSource = new dataset_source();
        indDatasetSource.setProperties(datasetSourceProperties);
        indDatasetSource.setTypes(datasetSourceTypes);
        setId(indDatasetSource);

        dataset_source newIndDatasetSource =
            em.find(dataset_source.class, indDatasetSource.getId());
        if (newIndDatasetSource != null) {
            indDatasetSource = em.merge(newIndDatasetSource);
        } else {
            em.persist(indDatasetSource);
        }

        dataset ds = new dataset();
        ds.setInv_dot_offers_dataset(Collections.singleton(indDatasetSource));
        indDatasetSource.setOffers_dataset(Collections.singleton(ds));

        indPublication.setHas_source(Collections.singleton(indDatasetSource));
        publisher indPublisher = new publisher();
        indPublisher.setId(Vocabulary.ONTOLOGY_IRI_dataset_descriptor + "/ctu");
        indPublisher.setInv_dot_has_publisher(Collections.singleton(indPublication));

        indPublication.setHas_publisher(Collections.singleton(indPublisher));
        descriptor.setInv_dot_has_published_dataset_snapshot(indPublication);

        return indPublication;
    }

    private dataset_publication storeMetadata(final dataset_source ds,
                                              final String descriptorType) {
        final description iDescription = createDescription(ds, descriptorType);

        final dataset_publication iPublication =
            createPublication(iDescription.getHas_dataset_descriptor());

        final EntityDescriptor d = new EntityDescriptor(URI.create(iPublication.getId()));

        em.merge(iDescription.getIs_description_of(), d);
        em.merge(iDescription.getHas_dataset_descriptor(), d);
        em.merge(
            ((dataset_source) iDescription.getHas_source().iterator().next()).getOffers_dataset()
                                                                             .iterator().next(), d);
        em.merge(iDescription, d);

        em.merge(iPublication.getHas_publisher().iterator().next(), d);
        em.merge(iPublication.getHas_source().iterator().next(), d);
        em.merge(
            ((dataset_source) iPublication.getHas_source().iterator().next()).getOffers_dataset()
                                                                             .iterator().next(), d);
        em.merge(iPublication, d);

        return iPublication;
    }

    /**
     * Computes a new descriptor of given type for the given dataset source.
     *
     * @param datasetSourceId IRI of the dataset source to compute
     * @param descriptorType  IRI of the descriptor type
     * @return new dataset descriptor
     */
    public dataset_descriptor computeDescriptorForDatasetSource(final String datasetSourceId,
                                                                final String descriptorType) {
        if (Vocabulary.s_c_spo_summary_descriptor.equals(descriptorType)) {
            return _computeDescriptorForDatasetSource(datasetSourceId, descriptorType,
                "compute-spo-summary-descriptor");
        } else if (Vocabulary.s_c_temporal_dataset_descriptor.equals(descriptorType)) {
            return _computeDescriptorForDatasetSource(datasetSourceId, descriptorType,
                "temporal-function");
        } else {
            LOG.error("Unknown descriptor type {}, not computing", descriptorType);
            return null;
        }
    }

    /**
     * Computes a new descriptor of given type for the given dataset source.
     *
     * @param datasetSourceId IRI of the dataset source to compute
     * @param descriptorType  IRI of the descriptor type
     * @return new dataset descriptor
     */
    public dataset_descriptor _computeDescriptorForDatasetSource(final String datasetSourceId,
                                                                 final String descriptorType,
                                                                 final String function) {
        final URI datasetSourceIri = URI.create(datasetSourceId);
        final dataset_source ds = em.find(dataset_source.class, datasetSourceIri);

        final StringBuilder urlBuilder = new StringBuilder(environment.getProperty("spipes.service"));
        // not using params - order is important

        urlBuilder.append("?id=").append(function);

        if (EntityToOwlClassMapper.isOfType(ds, Vocabulary.s_c_sparql_endpoint_dataset_source)) {
            urlBuilder.append("&datasetEndpointUrl=").append(getSingleProperty(ds,Vocabulary.s_p_has_endpoint_url));
        } else if (EntityToOwlClassMapper
            .isOfType(ds, Vocabulary.s_c_named_graph_sparql_endpoint_dataset_source)) {
            urlBuilder.append("&datasetEndpointUrl=").append(getSingleProperty(ds,Vocabulary.s_p_has_endpoint_url));
            urlBuilder.append("&snapshotGraphId=").append(getSingleProperty(ds,Vocabulary.s_p_has_graph_id));
        }

        final dataset_publication p = storeMetadata(ds, descriptorType);
        final dataset_source publishedDatasetSource = (dataset_source) p.getHas_source().iterator().next();

        LOG.info("Computing descriptor of type {}: {}", descriptorType, urlBuilder.toString());
        String s = remoteLoader.loadData(urlBuilder.toString(), new HashMap<>());
        LOG.info(" - done. Response length {}", s.length());

        final String uri =
            getSingleProperty(publishedDatasetSource,Vocabulary.s_p_has_endpoint_url) + "/statements";
        final String graphIri =
             getSingleProperty(publishedDatasetSource,Vocabulary.s_p_has_graph_id) ;

        final UriComponentsBuilder builder =
            UriComponentsBuilder.fromUriString(uri).queryParam("context", "<" + graphIri + ">");
        final URI urlWithQuery = URI.create(builder.build().encode().toUriString());

        final HttpHeaders headers = new HttpHeaders();
        headers.put("Content-type", Collections.singletonList("application/ld+json"));
        try {
            final HttpEntity<Object> entity = new HttpEntity<>(s, headers);
            LOG.trace("Putting remote data using {}", urlWithQuery.toString());
            final ResponseEntity<String> result =
                restTemplate.exchange(urlWithQuery, HttpMethod.POST, entity, String.class);
        } catch (HttpServerErrorException e) {
            LOG.error("Error when putting remote data, url: {}. Response Status: {}\n, " + "Body:",
                urlWithQuery.toString(), e.getStatusCode(), e.getResponseBodyAsString());
            throw new WebServiceIntegrationException("Unable to fetch remote data.", e);
        } catch (Exception e) {
            LOG.error("Error when putting remote data, url: {}.", urlWithQuery.toString(), e);
            throw new WebServiceIntegrationException("Unable to fetch remote data.", e);
        }

        return (dataset_descriptor) p.getHas_published_dataset_snapshot();
    }

    /**
     * Retrieves the last descriptor of given type for the given dataset source id.
     *
     * @param datasetDescriptorId id of the dataset Descriptor
     * @return content of the descriptor
     */
    public String getDescriptorContent(final String datasetDescriptorId, final String fileName) {
        final URI datasetDescriptorIri = URI.create(datasetDescriptorId);//URI.create(Vocabulary
        // .s_c_dataset_descriptor + "-" + datasetDescriptorId);
        final dataset_descriptor datasetDescriptor =
            em.find(dataset_descriptor.class, datasetDescriptorIri);
        final dataset_source datasetSource = getSourceForDescriptor(datasetDescriptor);

        if (fileName != null) {
            return datasetSourceDao
                .getSparqlConstructResult(datasetSource, "query/" + fileName + ".rq",
                    Collections.emptyMap());
        } else {
            return datasetSourceDao
                .getSparqlConstructResult(datasetSource, "query/get_full_endpoint.rq",
                    Collections.emptyMap());
        }
    }

    private dataset_source getSourceForDescriptor(final dataset_descriptor datasetDescriptor) {
        return em.createNativeQuery(
            "SELECT DISTINCT ?datasetSource { ?publication ?vocHasSource "
            + "?datasetSource. }", dataset_source.class)
                 .setParameter("vocHasSource", URI.create(Vocabulary.s_p_has_source))
                 .setParameter("publication", URI.create(
                     datasetDescriptor.getInv_dot_has_published_dataset_snapshot().getId()))
                 .getSingleResult();
    }
}
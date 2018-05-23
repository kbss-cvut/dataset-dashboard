package cz.cvut.kbss.datasetdashboard.dao;

import cz.cvut.kbss.datasetdashboard.dao.data.DataLoader;
import cz.cvut.kbss.datasetdashboard.dao.descriptors.DescriptorComputerParameterRegistry;
import cz.cvut.kbss.datasetdashboard.dao.descriptors.DescriptorComputerSpecification;
import cz.cvut.kbss.datasetdashboard.dao.util.IdCreator;
import cz.cvut.kbss.datasetdashboard.model.util.ModelHelper;
import cz.cvut.kbss.datasetdashboard.dao.util.LocalIdCreator;
import cz.cvut.kbss.datasetdashboard.dao.util.SparqlUtils;
import cz.cvut.kbss.datasetdashboard.dao.util.TimeSnapshotIdCreator;
import cz.cvut.kbss.datasetdashboard.exception.WebServiceIntegrationException;
import cz.cvut.kbss.datasetdashboard.model.util.DatasetSourceHelper;
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
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
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

import static cz.cvut.kbss.datasetdashboard.model.util.ModelHelper.getSingleProperty;
import static cz.cvut.kbss.datasetdashboard.model.util.ModelHelper.addType;
import static cz.cvut.kbss.datasetdashboard.model.util.ModelHelper.addObjectPropertyValue;

@Repository @PropertySource("classpath:config.properties") public class DatasetDescriptorDao
    extends BaseDao<dataset_descriptor> {

    @Autowired @Qualifier("remoteDataLoader") private DataLoader remoteLoader;

    @Autowired private DatasetSourceDao datasetSourceDao;

    @Autowired private EntityManager em;

    @Autowired private Environment environment;

    @Autowired private RestTemplate restTemplate;

    @Autowired private DescriptorComputerParameterRegistry registry;

    public DatasetDescriptorDao() {
        super(dataset_descriptor.class);
    }

    private String getId(final dataset_source ds) {
        final String id = DatasetSourceHelper.getHashCode(ds);
        if ( id != null ) {
            return new LocalIdCreator(id).createInstanceOf(Vocabulary.s_c_dataset_source);
        } else {
            throw new IllegalArgumentException("Dataset source of unsupported type " + ds);
        }
    }

    private description createDescription(final dataset_source indDatasetSource,
                                          final String type) {
        IdCreator idCreator = TimeSnapshotIdCreator.create();

        final dataset indDataset = new dataset();
        indDataset.setInv_dot_offers_dataset(Collections.singleton(indDatasetSource));

        indDatasetSource.setOffers_dataset(Collections.singleton(indDataset));

        final dataset_descriptor indDescriptor = new dataset_descriptor();
        indDescriptor.setId(idCreator.createInstanceOf(type));
        indDescriptor.setHas_dataset(Collections.singleton(indDataset));
        addType(indDescriptor,Vocabulary.s_c_dataset_descriptor);
        addType(indDescriptor,type);

        final description indDescription = new description();
        indDescription.setId(idCreator.createInstanceOf(Vocabulary.s_c_description));
        indDescription.setHas_dataset_descriptor(indDescriptor);
        indDescription.setHas_source(Collections.singleton(indDatasetSource));

        indDescriptor.setInv_dot_has_dataset_descriptor(indDescription);

        final described_data_artifact indArtifact = ModelHelper
            .create(described_data_artifact.class,Vocabulary.s_c_dataset_snapshot);
        addType(indArtifact,Vocabulary.s_c_dataset_snapshot);
        indArtifact.setInv_dot_is_description_of(Collections.singleton(indDescription));
        indArtifact.setInv_dot_describes(Collections.singleton(indDescriptor));

        indDescription.setIs_description_of(indArtifact);

        indDescriptor.setDescribes(indArtifact);

        return indDescription;
    }

    private String getDescriptorsEndpointForRealEndpoint(final String realEndpoint) {
        final String rdf4jServer = environment.getProperty("rdf4jServerForDescriptors");
        return new StringBuilder(rdf4jServer).append("/repositories/").append(
            SparqlUtils.getRepositoryIdForSparqlEndpoint(realEndpoint)).toString();
    }

    private dataset_publication createPublication(final dataset_descriptor indDescriptor, final String descriptorType) {
        final IdCreator idCreator = TimeSnapshotIdCreator.create();

        final dataset_publication indPublication = new dataset_publication();
        indPublication.setId(idCreator.createInstanceOf(Vocabulary.s_c_dataset_publication));
        indPublication.setHas_published_dataset_snapshot(indDescriptor);

//        final Map<String, Set<String>> datasetSourceProperties = new HashMap<>();
        final described_data_artifact dds = indDescriptor.getDescribes();
        final dataset_source dsx =
            (dataset_source) dds.getInv_dot_is_description_of().iterator().next().getHas_source()
                                .iterator().next();

        dataset_source indDatasetSource = new dataset_source();
        // TODO what to do for other dataset sources (downloadUrl). Should be outside of this method.
        addType(indDatasetSource,Vocabulary.s_c_single_snapshot_dataset_source);
        String eid = getSingleProperty(dsx, Vocabulary.s_p_has_endpoint_url);
        String gid = getSingleProperty(dsx, Vocabulary.s_p_has_graph_id);
        addType(indDatasetSource, Vocabulary.s_c_named_graph_sparql_endpoint_dataset_source);
        if (eid != null ) {
            addObjectPropertyValue(indDatasetSource, Vocabulary.s_p_has_endpoint_url,
                getDescriptorsEndpointForRealEndpoint(eid));
        }
        addObjectPropertyValue(indDatasetSource, Vocabulary.s_p_has_graph_id,
            SparqlUtils.getDescriptorGraphIri(descriptorType, gid));

        String id = getId(indDatasetSource);

        final EntityDescriptor desc = new EntityDescriptor(URI.create(id));
        dataset_source newIndDatasetSource = em.find(dataset_source.class, id, desc);
        if (newIndDatasetSource != null) {
            indDatasetSource = newIndDatasetSource;
        } else {
            em.persist(indDatasetSource, desc);
        }

        dataset ds = new dataset();
        ds.setInv_dot_offers_dataset(Collections.singleton(indDatasetSource));
        indDatasetSource.setOffers_dataset(Collections.singleton(ds));

        indPublication.setHas_source(Collections.singleton(indDatasetSource));

        publisher indPublisher = new publisher();
        indPublisher.setId(Vocabulary.ONTOLOGY_IRI_dataset_descriptor + "/ctu");
        indPublisher.setInv_dot_has_publisher(Collections.singleton(indPublication));

        indPublication.setHas_publisher(Collections.singleton(indPublisher));

        indDescriptor.setInv_dot_has_published_dataset_snapshot(indPublication);

        return indPublication;
    }

    private dataset_publication storeMetadata(final dataset_source ds,
                                              final String descriptorType) {
        final description iDescription = createDescription(ds, descriptorType);

        final dataset_publication iPublication =
            createPublication(iDescription.getHas_dataset_descriptor(), descriptorType);

        final EntityDescriptor d = new EntityDescriptor(URI.create(iPublication.getId()));

        em.merge(iDescription.getIs_description_of(), d);
        em.merge(iDescription.getHas_dataset_descriptor(), d);
        iDescription.getHas_source().forEach(
            (datasetSource) -> ((dataset_source) datasetSource).getOffers_dataset().forEach(
                (dataset) -> em.merge(dataset, d)));
        em.merge(iDescription, d);
        em.merge(iPublication.getHas_publisher().iterator().next(), d);
        iPublication.getHas_publisher().forEach((publisher) -> em.merge(publisher, d));
        iPublication.getHas_source().forEach(
            (datasetSource) -> ((dataset_source) datasetSource).getOffers_dataset().forEach(
                (dataset) -> em.merge(dataset, d)));
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
        final DescriptorComputerSpecification spec = registry.get(descriptorType);


        if ( spec != null) {
            return _computeDescriptorForDatasetSource(datasetSourceId, descriptorType, spec);
        } else {
            LOG.error("Unknown descriptor type {}, not computing", descriptorType);
            return null;
        }
    }

    /**
     * Removes the descriptor with the given IRI and its content.
     *
     * @param datasetDescriptorIri IRI of the dataset descriptor to remove
     * @return removed dataset descriptor metadata
     */
    public dataset_descriptor removeDescriptorForDatasetSource(final String datasetDescriptorIri) {
        final dataset_descriptor descriptor =
            em.find(dataset_descriptor.class, datasetDescriptorIri);

        final dataset_source datasetSource =
            (dataset_source) descriptor.getInv_dot_has_published_dataset_snapshot().getHas_source()
                                       .iterator().next();

        removeNamedGraphDatasetSource(datasetSource);

        em.remove(descriptor);
        return descriptor;
    }

    private URI createUrlForNamedGraphSparqlEndpointDatasetSource(final dataset_source ds) {
        final String uri = getSingleProperty(ds, Vocabulary.s_p_has_endpoint_url) + "/statements";
        final String graphIri = getSingleProperty(ds, Vocabulary.s_p_has_graph_id);

        final UriComponentsBuilder builder =
            UriComponentsBuilder.fromUriString(uri);
        if (graphIri != null) {
            builder.queryParam("context", "<" + graphIri + ">");
        }
        final URI urlWithQuery = URI.create(builder.build().encode().toUriString());
        return urlWithQuery;
    }

    private void removeNamedGraphDatasetSource(final dataset_source ds) {
        final URI urlWithQuery = createUrlForNamedGraphSparqlEndpointDatasetSource(ds);
        final HttpHeaders headers = new HttpHeaders();
        headers.put("Content-type", Collections.singletonList("application/ld+json"));
        try {
            final HttpEntity<Object> entity = new HttpEntity<>(headers);
            LOG.trace("Putting remote data using {}", urlWithQuery.toString());
            final ResponseEntity<String> result =
                restTemplate.exchange(urlWithQuery, HttpMethod.DELETE, entity, String.class);
        } catch (HttpServerErrorException e) {
            LOG.error("Error when putting remote data, url: {}. Response Status: {}\n, " + "Body:",
                urlWithQuery.toString(), e.getStatusCode(), e.getResponseBodyAsString());
            throw new WebServiceIntegrationException("Unable to fetch remote data.", e);
        } catch (Exception e) {
            LOG.error("Error when putting remote data, url: {}.", urlWithQuery.toString(), e);
            throw new WebServiceIntegrationException("Unable to fetch remote data.", e);
        }
    }

    /**
     * Computes a new descriptor of given type for the given dataset source.
     *
     * @param datasetSourceId IRI of the dataset source to compute
     * @param spec dataset source specification
     * @return new dataset descriptor
     */
    public dataset_descriptor _computeDescriptorForDatasetSource(final String datasetSourceId,
                                                                 final String descriptorType,
                                                                 final DescriptorComputerSpecification spec) {
        final URI datasetSourceIri = URI.create(datasetSourceId);
        final dataset_source ds = em.find(dataset_source.class, datasetSourceIri);

        final StringBuilder urlBuilder =
            new StringBuilder(environment.getProperty("spipes.service"));
        // not using params - order is important

        urlBuilder.append("?id=").append(spec.getFunctionId());

        if (ModelHelper.isOfType(ds, Vocabulary.s_c_sparql_endpoint_dataset_source)) {
            urlBuilder.append("&datasetEndpointUrl=")
                      .append(getSingleProperty(ds, Vocabulary.s_p_has_endpoint_url));
        } else if (ModelHelper
            .isOfType(ds, Vocabulary.s_c_named_graph_sparql_endpoint_dataset_source)) {
            urlBuilder.append("&datasetEndpointUrl=")
                      .append(getSingleProperty(ds, Vocabulary.s_p_has_endpoint_url));
            urlBuilder.append("&snapshotGraphId=")
                      .append(getSingleProperty(ds, Vocabulary.s_p_has_graph_id));
        }

        urlBuilder.append(SparqlUtils.createUrlString(spec.getMap()));

        final dataset_publication p = storeMetadata(ds, descriptorType);

        LOG.info("Computing descriptor of type {}: {}", descriptorType, urlBuilder.toString());
        String s = remoteLoader.loadData(urlBuilder.toString(), new HashMap<>());
        LOG.info(" - done. Response length {}", s.length());

        final dataset_source publishedDatasetSource =
            (dataset_source) p.getHas_source().iterator().next();
        final URI urlWithQuery =
            createUrlForNamedGraphSparqlEndpointDatasetSource(publishedDatasetSource);

        final HttpHeaders headers = new HttpHeaders();
        headers.put("Content-type", Collections.singletonList("application/ld+json"));
        try {
            final HttpEntity<Object> entity = new HttpEntity<>(s, headers);
            LOG.trace("Putting remote data using {}", urlWithQuery.toString());
            final ResponseEntity<String> result =
                restTemplate.exchange(urlWithQuery, HttpMethod.PUT, entity, String.class);
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
            "SELECT DISTINCT ?datasetSource { ?publication ?vocHasSource ?datasetSource. }",
            dataset_source.class)
                 .setParameter("vocHasSource", URI.create(Vocabulary.s_p_has_source))
                 .setParameter("publication", URI.create(
                     datasetDescriptor.getInv_dot_has_published_dataset_snapshot().getId()))
                 .getSingleResult();
    }
}
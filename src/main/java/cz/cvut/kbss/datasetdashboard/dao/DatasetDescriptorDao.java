package cz.cvut.kbss.datasetdashboard.dao;

import cz.cvut.kbss.datasetdashboard.exception.WebServiceIntegrationException;
import cz.cvut.kbss.datasetdashboard.service.data.DataLoader;
import cz.cvut.kbss.ddo.Vocabulary;
import cz.cvut.kbss.ddo.model.dataset;
import cz.cvut.kbss.ddo.model.dataset_descriptor;
import cz.cvut.kbss.ddo.model.dataset_publication;
import cz.cvut.kbss.ddo.model.dataset_source;
import cz.cvut.kbss.ddo.model.described_data_artifact;
import cz.cvut.kbss.ddo.model.description;
import cz.cvut.kbss.ddo.model.publisher;
import cz.cvut.kbss.jopa.model.EntityManager;
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
import org.springframework.transaction.annotation.Transactional;
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
        if (ds.getTypes().contains(Vocabulary.s_c_named_graph_sparql_endpoint_dataset_source)) {
            ds.setId(Vocabulary.s_c_dataset_source + "-" + (
                ds.getProperties().get(Vocabulary.s_p_has_endpoint_url).iterator().next()
                    + ds.getProperties().get(Vocabulary.s_p_has_graph_id).iterator().next()
            ).hashCode());
        } else if (ds.getTypes().contains(Vocabulary.s_c_sparql_endpoint_dataset_source)) {
            ds.setId(Vocabulary.s_c_dataset_source + "-" + (
                ds.getProperties().get(Vocabulary.s_p_has_endpoint_url).iterator().next()
            ).hashCode());
        }
    }

    private description createDescription(final dataset_source iDescriptionDS, final String type) {
        String time = F.format(Calendar.getInstance().getTime());

        dataset iDataset = new dataset();
        iDataset.setInv_dot_offers_dataset(Collections.singleton(iDescriptionDS));

        final dataset_descriptor iDescriptor = new dataset_descriptor();
        iDescriptor.setId(Vocabulary.s_c_dataset_descriptor +"-"+time);
        iDescriptor.setHas_dataset(Collections.singleton(iDataset));
        final Set<String> types = new HashSet<>();
        types.add(Vocabulary.s_c_dataset_descriptor);
        types.add(type);
        iDescriptor.setTypes(types);
        final Map<String, Set<String>> properties = new HashMap<>();
        iDescriptor.setProperties(properties);

        final description iDescription = new description();
        iDescription.setId(Vocabulary.s_c_description +"-"+time);
        iDescription.setHas_dataset_descriptor(iDescriptor);
        iDescriptor.setInv_dot_has_dataset_descriptor(iDescription);
        iDescription.setHas_source(Collections.singleton(iDescriptionDS));

        iDescriptionDS.setOffers_dataset(Collections.singleton(iDataset));

        final described_data_artifact iArtifact = new described_data_artifact();
        iArtifact.setId(Vocabulary.s_c_dataset_snapshot +"-"+time);
        iArtifact.setTypes(Collections.singleton(Vocabulary.s_c_dataset_snapshot));
        iArtifact.setInv_dot_is_description_of(Collections.singleton(iDescription));
        iArtifact.setInv_dot_describes(Collections.singleton(iDescriptor));
        iDescription.setIs_description_of(iArtifact);

        iDescriptor.setDescribes(iArtifact);

        return iDescription;
    }

    private dataset_publication createPublication(final dataset_descriptor descriptor) {
        String time = F.format(Calendar.getInstance().getTime());

        final dataset_publication iPublication = new dataset_publication();
        iPublication.setId(Vocabulary.s_c_dataset_publication + "-" + time);
        iPublication.setHas_published_dataset_snapshot(descriptor);

        final dataset_source iPublicationDS = new dataset_source();
        final Map<String, Set<String>> propertiesDS = new HashMap<>();
        propertiesDS.put(Vocabulary.s_p_has_endpoint_url,
            Collections.singleton(environment.getProperty("descriptorsEndpoint")));
        propertiesDS.put(Vocabulary.s_p_has_graph_id, Collections.singleton(descriptor.getId()));
        iPublicationDS.setProperties(propertiesDS);
        final Set<String> typesDS = new HashSet<>();
        typesDS.add(Vocabulary.s_c_named_graph_sparql_endpoint_dataset_source);
        typesDS.add(Vocabulary.s_c_single_snapshot_dataset_source);
        iPublicationDS.setTypes(typesDS);
        setId(iPublicationDS);

        dataset ds = new dataset();
        ds.setInv_dot_offers_dataset(Collections.singleton(iPublicationDS));
        iPublicationDS.setOffers_dataset(Collections.singleton(ds));

        iPublication.setHas_source(Collections.singleton(iPublicationDS));
        publisher iPublisher = new publisher();
        iPublisher.setId(Vocabulary.ONTOLOGY_IRI_dataset_descriptor+"/ctu");
        iPublisher.setInv_dot_has_publisher(Collections.singleton(iPublication));

        iPublication.setHas_publisher(Collections.singleton(iPublisher));
        descriptor.setInv_dot_has_published_dataset_snapshot(iPublication);

        return iPublication;
    }

    private dataset_publication storeMetadata(final dataset_source ds, final String descriptorType) {
        final description iDescription = createDescription(ds, descriptorType);

        final dataset_publication iPublication = createPublication(iDescription.getHas_dataset_descriptor());

        em.merge(iDescription.getIs_description_of());
        em.merge(iDescription.getHas_dataset_descriptor());
        em.merge(iDescription.getHas_source().iterator().next());
        em.merge(((dataset_source) iDescription.getHas_source().iterator().next()).getOffers_dataset().iterator().next());
        em.merge(iDescription);

        em.merge(iPublication.getHas_publisher().iterator().next());
        em.merge(iPublication.getHas_source().iterator().next());
        em.merge(((dataset_source) iPublication.getHas_source().iterator().next()).getOffers_dataset().iterator().next());
        em.merge(iPublication);

        return iPublication;
    }

    @Transactional("txManager")
    public dataset_descriptor computeDescriptorForDatasetSource(final String datasetSourceId, final String descriptorType) {
        final URI datasetSourceIri
            = URI.create(Vocabulary.s_c_dataset_source + "-" + datasetSourceId);
        if ( Vocabulary.s_c_spo_summary_descriptor.equals(descriptorType)) {
            final dataset_source ds = em.find(dataset_source.class, datasetSourceIri);

            String url = environment.getProperty("spipes.service");
            // not using params - order is important
            url += "?id=" + "compute-spo-summary-descriptor";
            if (ds.getTypes().contains(Vocabulary.s_c_sparql_endpoint_dataset_source)) {
                url += "&datasetEndpointUrl=" + ds.getProperties().get(Vocabulary.s_p_has_endpoint_url).iterator().next();
            } else if (ds.getTypes().contains(Vocabulary.s_c_named_graph_sparql_endpoint_dataset_source)) {
                url += "&datasetEndpointUrl=" + ds.getProperties().get(Vocabulary.s_p_has_endpoint_url).iterator().next();
                url += "&snapshotGraphId=" + ds.getProperties().get(Vocabulary.s_p_has_graph_id).iterator().next();
            }

            dataset_publication p = storeMetadata(ds,descriptorType);

            final dataset_source publishedDatasetSource = (dataset_source) p.getHas_source().iterator().next();
            LOG.info("Computing SPO: {}", url);
            String s = remoteLoader.loadData(url, new HashMap<>());
            LOG.info(" - done. Response length {}", s);

            final HttpHeaders headers = new HttpHeaders();

            final String uri =    publishedDatasetSource.getProperties().get(Vocabulary.s_p_has_endpoint_url).iterator().next()
                + "/statements";

            final String graphIri = "<" + publishedDatasetSource.getProperties().get(Vocabulary.s_p_has_graph_id).iterator().next() + ">";

            System.out.println(graphIri);
            UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(uri)
                .queryParam("context", graphIri);
            String uriBuilder = builder.build().encode().toUriString();

            System.out.println(uriBuilder);

            headers.put("Content-type",Collections.singletonList("application/ld+json"));

            final URI urlWithQuery = URI.create(uriBuilder);
            try {
                final HttpEntity<Object> entity = new HttpEntity<>(s, headers);
                if (LOG.isTraceEnabled()) {
                    LOG.trace("Putting remote data using {}", urlWithQuery.toString());
                }
                final ResponseEntity<String> result = restTemplate.exchange(urlWithQuery,
                    HttpMethod.POST, entity, String.class);
            } catch (HttpServerErrorException e) {
                LOG.error("Error when putting remote data, url: {}. Response Status: {}\n, Body:",
                    urlWithQuery.toString(), e.getStatusCode(), e.getResponseBodyAsString());
                throw new WebServiceIntegrationException("Unable to fetch remote data.", e);
            } catch (Exception e) {
                LOG.error("Error when putting remote data, url: {}.", urlWithQuery.toString(), e);
                throw new WebServiceIntegrationException("Unable to fetch remote data.", e);
            }

            return (dataset_descriptor) p.getHas_published_dataset_snapshot();
        } else {
            LOG.error("Unknown descriptor type {}, not computing", descriptorType);
            return null;
        }
    }
}

package cz.cvut.kbss.datasetdashboard.dao.data;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

/**
 * Classpath-based file content loader.
 */
@Repository("localDataLoader")
public class FileDataLoader implements DataLoader {

    private static final Logger LOG = LoggerFactory.getLogger(FileDataLoader.class);

    /**
     * Loads data from the specified file.
     * The file is loaded as a classloader resource, so it should be on classpath or it should be
     * an absolute path.
     *
     * @param fileName Name of the file to load
     * @param params   The parameters are ignored in this implementation
     * @return File contents as string
     */
    public String loadData(String fileName, Map<String, String> params) {
        final InputStream is = this.getClass().getClassLoader().getResourceAsStream(fileName);
        if (is == null) {
            throw new IllegalArgumentException("File " + fileName + " not found.");
        }
        try (final BufferedReader reader = new BufferedReader(new InputStreamReader(is))) {
            final StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
                sb.append('\n');
            }
            return sb.toString();
        } catch (IOException e) {
            LOG.error("Unable to read file contents.", e);
            return "";
        }
    }
}

package cz.cvut.kbss.datasetdashboard.dao.descriptors;

import java.util.HashMap;
import java.util.Map;

public class DescriptorComputerSpecification {

    private final String functionId;
    private final Map<String,String> map = new HashMap<>();

    public DescriptorComputerSpecification(final String functionId) {
        this.functionId = functionId;
    }

    public void add(String param, String value) {
        map.put(param,value);
    }

    public String getFunctionId() {
        return functionId;
    }

    public Map<String, String> getMap() {
        return map;
    }
}

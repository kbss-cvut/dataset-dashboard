package cz.cvut.kbss.datasetdashboard.dao.util;

import cz.cvut.kbss.ddo.model.Thing;
import org.junit.Assert;
import org.junit.Test;

public class JopaHelperTest {

    @Test
    public void testCreate() {
        final Thing c = JopaHelper.create(
            TestEntity.class, "http://example.org/C", "instanceid");
        Assert.assertTrue(c.getTypes().contains("http://example.org/C"));
    }

//    @Test
//    public void testCreateNoType() {
//        final Thing c = JopaHelper.create(
//            TestEntity.class, "instanceid");
//        Assert.assertTrue(c.getTypes().contains("http://example.org/C"));
//    }
}

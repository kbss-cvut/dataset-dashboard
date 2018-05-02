package cz.cvut.kbss.datasetdashboard.dao.util;

import cz.cvut.kbss.datasetdashboard.model.util.ModelHelper;
import cz.cvut.kbss.ddo.model.Thing;
import org.junit.Assert;
import org.junit.Test;

public class ModelHelperTest {

    @Test
    public void testCreate() {
        final Thing c = ModelHelper.create(
            TestEntity.class, "http://example.org/C", "instanceid");
        Assert.assertTrue(c.getTypes().contains("http://example.org/C"));
    }

//    @Test
//    public void testCreateNoType() {
//        final Thing c = ModelHelper.create(
//            TestEntity.class, "instanceid");
//        Assert.assertTrue(c.getTypes().contains("http://example.org/C"));
//    }

    @Test
    public void testAddType() {
        String testType = "http://example.org/testC";
        final TestEntity te = new TestEntity();
        ModelHelper.addType(
            te, testType);
        Assert.assertTrue(te.getTypes().contains(testType));
    }

    @Test
    public void testAddObjectPropertyValue() {
        String testProperty = "http://example.org/testP";
        String testValue = "http://example.org/testP/value";
        final TestEntity te = new TestEntity();
        ModelHelper.addObjectPropertyValue(
            te, testProperty,testValue);
        Assert.assertTrue(te.getProperties().get(testProperty).contains(testValue));
    }

    @Test
    public void testGetSingleProperty() {
        String testProperty = "http://example.org/testP";
        String testValue = "http://example.org/testP/value";
        final TestEntity te = new TestEntity();
        ModelHelper.addObjectPropertyValue(
            te, testProperty,testValue);

        Assert.assertEquals(ModelHelper.getSingleProperty(
            te, testProperty),testValue);
    }
}

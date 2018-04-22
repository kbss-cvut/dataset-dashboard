package cz.cvut.kbss.datasetdashboard.dao.util;

import org.junit.Assert;
import org.junit.Test;

public class IdCreatorTest {

    @Test
    public void testRepeatability() {
        final IdCreator idCreator = IdCreator.create();
        Assert.assertEquals(idCreator.create("x"),idCreator.create("x"));
    }

//    @Test
    public void testUniqueness() {
        final IdCreator idCreator1 = IdCreator.create();
        final IdCreator idCreator2 = IdCreator.create();
        Assert.assertNotEquals(idCreator1.create("x"),idCreator2.create("x"));
    }
}

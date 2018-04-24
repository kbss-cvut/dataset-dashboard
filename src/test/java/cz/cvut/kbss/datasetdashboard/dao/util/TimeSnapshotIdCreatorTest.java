package cz.cvut.kbss.datasetdashboard.dao.util;

import org.junit.Assert;
import org.junit.Test;

public class TimeSnapshotIdCreatorTest {

    @Test
    public void testRepeatability() {
        final IdCreator idCreator = TimeSnapshotIdCreator.create();
        Assert.assertEquals(
            idCreator.createInstanceOf("x"),
            idCreator.createInstanceOf("x"));
    }

//    @Test
    public void testUniqueness() {
        final IdCreator idCreator1 = TimeSnapshotIdCreator.create();
        final IdCreator idCreator2 = TimeSnapshotIdCreator.create();
        Assert.assertNotEquals(
            idCreator1.createInstanceOf("x"),
            idCreator2.createInstanceOf("x"));
    }
}

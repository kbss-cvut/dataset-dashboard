'use strict';

import SchemaUtils from "../../../../../../js/components/dashboard/widgets/schema-widget/SchemaUtils";
import Rdf from "../../../../../../js/vocabulary/Rdf";
describe("A SchemaUtils Test", function() {

    it("valid isDatatype", function() {
        const dt = SchemaUtils.isDataType(Rdf.NS+"langString");
        expect(dt).toEqual(true);
    });

    [
        "http://www.w3.org/2001/XMLSchema#int",
        "http://www.w3.org/2001/XMLSchema#string",
        "http://www.w3.org/2001/XMLSchema#boolean",
        "http://www.w3.org/2001/XMLSchema#dateTime"
    ].forEach((dt) => {
        it(`isDatatype - valid XSD type ${dt}`, function() {
            expect(SchemaUtils.isDataType(dt)).toEqual(true);
        });
    });

    it("invalid isDatatype", function() {
        const dt = SchemaUtils.isDataType(Rdf.NS+"xlangString");
        expect(dt).toEqual(false);
    });

    it("reordering of node pair gets the same identifier of the edge", function() {
        const eid1 = SchemaUtils.getEdgeId("abcd","efgh");
        const eid2 = SchemaUtils.getEdgeId("efgh","abcd");
        expect(eid1).toEqual(eid2);
    });

    it("two subsequent calls of getEdgeId give the same id", function() {
        const eid1 = SchemaUtils.getEdgeId("abcd","efgh");
        const eid2 = SchemaUtils.getEdgeId("abcd","efgh");
        expect(eid1).toEqual(eid2);
    });

    it("two different node sets give different ids", function() {
        const eid1 = SchemaUtils.getEdgeId("abcd","efgh");
        const eid2 = SchemaUtils.getEdgeId("abc","efg");
        expect(eid1 == eid2).toBeFalsy();
    });

    it("ensureNodeExists - creating the same node twice", function() {
        const iri = "http://example.org/x";
        const map = {};
        const run = () => SchemaUtils.ensureNodeExists(map,iri,()=>{return {}},i=>i)
        const eid1 = run();
        expect(Object.keys(map).length == 1).toBeTruthy();
        const eid2 = run();
        expect(Object.keys(map).length == 1).toBeTruthy();
    });
});
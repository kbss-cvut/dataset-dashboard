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
});
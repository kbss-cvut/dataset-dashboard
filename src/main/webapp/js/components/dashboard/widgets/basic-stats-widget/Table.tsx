'use strict';

import * as React from "react";
import {BootstrapTable} from 'react-bootstrap-table';

interface Props {
    sortName: string,
    data: any[],
    columns: any[]
}

export const Table: React.SFC<Props> = (props) => {
    let options = {
        sortName: props.sortName,
        // TODO sortOrder: 'desc',
        sizePerPageList: [{
            text: '8', value: 8
        }],
        sizePerPage: 8,
        pageStartIndex: 1, // where to start counting the pages
        paginationSize: 1,  // the pagination bar size.
        prePage: '<', // Previous page button text
        nextPage: '>', // Next page button text
        firstPage: '<<', // First page button text
        lastPage: '>>', // Last page button text
        // paginationPosition: 'bottom',  // default is bottom, top and both is all available
        paginationShowsTotal: false
    }
    return (
        <BootstrapTable tableStyle={{margin: -8, borderRadius: 0, border: 0}}
                        options={options}
                        data={props.data}
                        striped={true}
                        hover={true}
                        condensed pagination>
            {props.columns}
        </BootstrapTable>
    );
}
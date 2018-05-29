'use strict';

import * as React from "react";
import {RingLoader} from 'react-spinners';

interface Props {
    text: string,
    classes: string
};

export const Mask: React.SFC<Props> = props => (
    <div className={props.classes ? props.classes : 'mask'}>
        <div className='spinner-container'>
            <div style={{width: 32, height: 32, margin: 'auto'}}>
                <RingLoader color='#337ab7' size={32} loading={true}/>
            </div>
            <div className='spinner-message'>{props.text ? props.text : 'Please Wait'}</div>
        </div>
    </div>
);
'use strict';

import * as React from "react";

import Ddo from "../../../../vocabulary/Ddo";
import Timeline from 'react-calendar-timeline';
import moment = require("moment");

interface Props {
    descriptorContent : string
}

class TemporalWidget extends React.Component<Props> {

    constructor(props) {
        super(props);
    };

    compute(results){
        let k = 0;
        const items= results.map((i)=> {
            const minD = i[Ddo.NS+'temporal-v1/beginDate'][0]['@value'];
            const maxD = i[Ddo.NS+'temporal-v1/endDate'][0]['@value'];
            return {
                id:k,
                group: k++,
                start_time: moment(new Date(minD)),
                end_time: moment(new Date(maxD)),
                title: i['@id']
            };
        });

        let l = 0;
        const groups= results.map((i)=> {
            return {
                id:l++,
                title: i['@id']
            };
        });
        return {items:items,groups:groups};
    }

    render() {
        const normalize = date => {
            return new Date(date).toLocaleTimeString(
                "en-US",
                {year: 'numeric', month:'short', day: 'numeric' }
                )
        }

// jsx
        const {items,groups} = this.compute(this.props.descriptorContent);
        return <div>
                    <span> {(items) ?
                        <span>
                            <span>
                                From <span className="badge">{normalize(items[0].start_time)}</span><br/>
                                To <span className="badge">{normalize(items[0].end_time)}</span>
                            </span>
                            <span>
                                <Timeline items={items}
                                      groups={groups}
                                          minZoom={86400*1000*365.4}
                                          maxZoom={86400*1000*365.4*100}
                                      defaultTimeStart={moment().add(-50, 'year')}
                                      defaultTimeEnd={moment().add(1, 'year')}
                                      timesteps={{ year: 1 }}/>
                            </span>
                        </span>
                        : <span>No temporal information available</span> }
                    </span>
                </div>
    };
}

export default TemporalWidget;
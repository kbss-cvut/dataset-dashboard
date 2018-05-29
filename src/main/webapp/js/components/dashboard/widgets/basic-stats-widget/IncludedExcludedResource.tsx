import * as React from "react";

interface Props {
    entityIri: string
    label: string,
    excluded: boolean,
}

export const IncludedExcludedResource: React.SFC<Props> = (props) => {
    let component = <span>{props.label}</span>;
    if (props.excluded) {
        component = <del> {component} </del>
    }
    return <a href={props.entityIri} target="_blank">{component}</a>;
}
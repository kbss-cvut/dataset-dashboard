import * as React from "react";

interface IProps {
    entityIri: string
    label: string,
    excluded: boolean,
}

export const IncludedExcludedResource: React.SFC<IProps> = (props) => {
    let component = <span>{props.label}</span>;
    if (props.excluded) {
        component = <del> {component} </del>
    }
    return <a href={props.entityIri} target="_blank">{component}</a>;
}
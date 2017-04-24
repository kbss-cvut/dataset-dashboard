import React, {PropTypes} from "react";

class Container extends React.Component {
    constructor(props) {
        super(props);
    }

    render = () => {
        return (
            <div className="body">
                <div className="main_container">
                    {this.props.children}
                </div>
            </div>
        );
    };
}
;

Container.propTypes = {
    children: PropTypes.array,
};

export default Container;
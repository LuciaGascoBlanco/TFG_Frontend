import React from "react";
import {Route} from "react-router-dom";
import "./CleanLayout.css"

class CleanLayout extends React.Component {
    render() {
        return (
            <div className="clean-layout">
                <div className="clean-layout-body">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

const CleanLayoutRoute = ({component: Component, ...rest}) => {
    return (
            <Route {...rest} render={matchProps => (
                    <CleanLayout>
                        <Component {...matchProps} />
                    </CleanLayout>
            )} />
    )
};

export default CleanLayoutRoute;
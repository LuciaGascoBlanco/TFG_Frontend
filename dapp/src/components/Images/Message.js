import * as React from "react";
import {Link} from "react-router-dom";

class Message extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
             authorIdM : props.authorIdM,
             authorM : props.authorM,
             dateM : props.dateM,
             contentM : props.contentM
        }
    }

    render() {
        return (
            <div className = "box4">
                <div className = "box-header">
                    <Link to ={`/users/${this.state.authorIdM}`} className = "box-author">{this.state.authorM}</Link>
                    <div className = "box-date">{this.state.dateM}</div>
                </div>
                <div className = "message-content">{this.state.contentM}</div>
            </div>
        )
    }
}

export default Message;
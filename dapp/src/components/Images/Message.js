import * as React from "react";
import './Images.css';

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
                    <div className = "box-author">{this.state.authorM}</div>
                    <div className = "box-date">{this.state.dateM}</div>
                </div>
                <div className = "message-content">{this.state.contentM}</div>
            </div>
        )
    }
}

export default Message;
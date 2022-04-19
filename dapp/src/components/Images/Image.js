import * as React from "react";
import './Images.css';

class Image extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
             authorId : props.authorId,
             author : props.author,
             date : props.date,
             title : props.title,
             price : props.price,
             hash : props.hash,
             url : props.url,
             bool : props.bool
        }
    }

    render() {
        return (
            <div className = "box">
                <div className = "box-header">
                    <div className = "box-author">{this.state.author}</div>
                    <div className = "box-date">{this.state.date}</div>
                </div>
                <div className = "image-title">{this.state.title}</div>
                <div className = "image-title">{this.state.hash}</div>
                <div className = "image-title">{this.state.price}</div>
                <img className = "image-content2" alt = {this.state.title} src = {`data:image/jpg;base64,${this.state.url}`}/>
            </div>
        )
    }
}

export default Image;
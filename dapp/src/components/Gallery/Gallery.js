import React from 'react';
import {request} from "../../helpers";
import {formatDate, formatName} from "../Box/Box";
import Image from "./Image";
import './Gallery.css';
import gallery from '../../public/Galeria.png';

class Gallery extends React.Component {
     constructor(props) {
         super(props);
         this.state = {
             images : [],
             hideMore : false
         }
         this.fileInput = React.createRef();
     }

    componentDidMount() {
        request('get', "/v1/community/gallery", {},  
            (response) => {
                this.state.images.push.apply(this.state.images, response.data);
                this.setState({images : this.state.images, hideMore : response.data.length === 0});
            },
            (error) => {})
     }

    render() {
        return(
            <div>
                <img src={gallery} alt="header" width="auto" height="210"/>               
                <div className = "gallery-body"> {this.state.images.length > 0 && this.state.images.map((image) => <Image key= {image.id} authorId = {image.userDto.id} author = {formatName(image.userDto)} date = {formatDate(image.createdDate)} title = {image.title} price = {image.price} hash = {image.hash} url = {image.path} />)} </div>
                {this.state.images.length === 0 && <div></div>}               
            </div>
        );
    }
}

export default Gallery;
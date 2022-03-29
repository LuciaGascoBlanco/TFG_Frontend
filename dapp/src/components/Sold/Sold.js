import * as React from "react";
import {Link} from "react-router-dom";
import './../Gallery/Gallery.css';
import {request} from "../../helpers";
import {formatDate, formatName} from "../Box/Box";

class Sold extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imagesArray: []
        }
    }

    //Probar que B no vea los comprados de A con distintos dueños...
    //Cuando todo comprobado, hacer que en galería desaparezca la foto comprada para TODOS los usuarios

    componentDidMount(){
        request('get', "/v1/community/imageSold", {},
            (response) => {
                this.state.imagesArray.unshift.apply(this.state.imagesArray, response.data);
                this.setState({images : this.state.images});
                console.log("imagesArray: ", this.state.imagesArray);},
            (error) => {})
    }

    render() {
        return (
            <div className="gallery-body">
                {this.state.imagesArray.map((image, i) =>
                    <section className="image-gallery" key={i}>
                        <div className = "image-gallery-header">
                            <div className = "image-title">{image.title + " - "}</div>
                            <div className = "price">{image.price + " wei"}</div>
                            <div className = "box-date">{formatDate(image.createdDate)}</div>
                        </div>
                        <img className = "image-content" alt = {image.title} src = {`data:image/jpg;base64,${image.path}`}/>
                        <div className="image-gallery-bottom">
                            <Link to ={`/users/${image.authorId}`} className = "box-author">{formatName(image.userDto)}</Link>
                        </div>
                    </section>)}
            </div>
        )
    }
}

export default Sold;
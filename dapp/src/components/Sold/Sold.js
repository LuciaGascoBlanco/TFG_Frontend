import * as React from "react";
import './../Gallery/Gallery.css';
import {request} from "../../helpers";
import {formatDate, formatName} from "../Box/Box";
import purchases from '../../public/Purchases.png';

import {Link} from "react-router-dom";

class Favorites extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imagesArray: [],
            color : [],
            imagesLikeArray: []
        }
    }

    componentDidMount(){
        request('get', "/v1/community/imageSold", {},
            (response) => {
                this.state.imagesArray.unshift.apply(this.state.imagesArray, response.data);
                this.setState({imagesArray: this.state.imagesArray})
                this.state.imagesArray.map((image, index) => {
                    if(image.like === "true") {
                        document.getElementById(index).style.fill = "#f70707";

                        var newItemsArr = JSON.parse(JSON.stringify(this.state.color));
                        if(!newItemsArr[index]){ newItemsArr[index] = true }                        //cambiar color[i] a true
                        this.setState({color : newItemsArr}); 
                        return true;                     
                    } else {return true;}
                })
            },
            (error) => {})
    }

    likePressed = (image, i) => e => {
        e.preventDefault();
        var newItemsArr = JSON.parse(JSON.stringify(this.state.color));

        let data = new FormData();                              
        data.append('hash', image.hash);

        if(!this.state.color[i]) {                                              
            document.getElementById(i).style.fill = "#f70707";

            if(!newItemsArr[i]){ newItemsArr[i] = true }                        //cambiar color[i] a true
            this.setState({color : newItemsArr});

            request('post', "/v1/community/like", data,                         //postLike
                        (response) => {},
                        (error) => {})

        } else {                                                             
            document.getElementById(i).style.fill = "white";
     
            if(newItemsArr[i]) { newItemsArr[i] = false }                        //cambiar color[i] a false
            this.setState({color : newItemsArr});

            request('post', "/v1/community/dislike", data,                       //postDislike
                        (response) => {},
                        (error) => {})
        }
    }

    onMouseOver = (hash) => e => {
        e.preventDefault();
        this.props.photoClick(hash);
    }

    render() {
        return (
            <div>
                <img src={purchases} alt="header" width="auto" height="210"/>
                <div className="gallery-body">
                    {this.state.imagesArray.map((image, i) =>
                        <section className="image-gallery" key={i}>
                            <div className = "image-gallery-header">
                                <div className = "image-title">{image.title + " - "}</div>
                                <div className = "price">{image.price + " Wei"}</div>
                                <div className = "box-date">{formatDate(image.createdDate)}</div>
                            </div>
                            <Link to={{pathname: "/history"}}><img id = "image-content" className = "image-content" alt = {image.title} src = {`data:image/jpg;base64,${image.path}`} onMouseOver={this.onMouseOver(image.hash)}/></Link>          
                            <div className="image-gallery-bottom">
                                <div className = "box-author">{formatName(image.userDto)}</div>
                                <button className = "box-btnLike" onClick={this.likePressed(image, i)}>
                                    <svg id = {i} className="like" width="100" height="85" viewBox="0 0 100 85"><path d="M92.71,7.27L92.71,7.27c-9.71-9.69-25.46-9.69-35.18,0L50,14.79l-7.54-7.52C32.75-2.42,17-2.42,7.29,7.27v0 c-9.71,9.69-9.71,25.41,0,35.1L50,85l42.71-42.63C102.43,32.68,102.43,16.96,92.71,7.27z"></path></svg>
                                </button>
                            </div>
                        </section>)}
                </div>
            </div>
        )
    }
}

export default Favorites;
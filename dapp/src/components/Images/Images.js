import React from 'react';
import {request, upload} from "../../helpers";
import {formatDate, formatName} from "../Box/Box";
import Image from "./Image";
import Message from "./Message";
import './Images.css';

import BigNumber from "bignumber.js";
import Web3 from 'web3';
import Photo from '../../abis/Photo.json';

class Images extends React.Component {
     constructor(props) {
         super(props);
         this.state = {
             account: '',
             contract: null,
             images : [],
             postContent : "",
             postContent2 : "",
             page : 0,
             hideMore : false,
             imgSrc : null,
             msgError: "",

             messages : [],
             pageM : 0,
             hideMoreM : false,
             postContentM : ""
         }
         this.fileInput = React.createRef();
     }

    async loadWeb3() {
        if (window.ethereum) {
          window.web3 = new Web3(window.ethereum)
          await window.ethereum.enable()
        } else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider)
        } else {window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')}
    }

    async loadBlockchainData() {
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        this.setState({account: accounts[0]})

        const networkId = await web3.eth.net.getId();
        const networkData = Photo.networks[networkId];
          if(networkData) {
            const abi = Photo.abi;
            const address = networkData.address;
            const contract = new web3.eth.Contract(abi, address);
            this.setState({contract})      
          } else {window.alert('Smart contract not deployed to detected network.')}
    }

    onPublish = (e) => {
         e.preventDefault();
         if (this.state.imgSrc) {
             let data = new FormData();
             data.append('file', this.fileInput.current.files[0], this.fileInput.current.files[0].name);    //formData.append(name, value, filename);
             data.append('title', this.state.postContent);
             data.append('price', this.state.postContent2);
             upload("/v1/community/images", data,
                    (response) => {
                        request('get', `/v1/community/images?page=${this.state.page}`, {},
                            (response) => {
                                this.setState({images : response.data, hideMore : response.data.length === 0, imgSrc : null, postContent : "", postContent2 : ""});
                                document.getElementById('box1').reset();  //
                                this.state.images.map((image, i) => {
                                    if(i === 0) {     
                                        //mint 
                                        var BNPrice = new BigNumber(image.price);                                 
                                        var StringHash = JSON.stringify(image.hash);
                                        this.state.contract.methods.mint(BNPrice, StringHash).send({from: this.state.account})
                                        .once('receipt', (receipt) => {console.log("Ha hecho el mint");}) 
                                        .on("transactionHash", function () {console.log("Hash")})
                                        .on("confirmation", function () {console.log("Confirmed");})
                                        .on("error", async function () {   //si se hace un reject en la transacción
                                            console.log("Error");
                                            request('delete', `/v1/community/delete?page=${this.state.page}`, {},
                                                (response) => {
                                                    this.setState({images : response.data, hideMore : response.data.length === 0, imgSrc : null, postContent : "", postContent2 : ""}); 
                                                    console.log(this.state.images);
                                                },                      
                                                (error) => {})
                                        }.bind(this));
                                    }
                                return(console.log(StringHash))})  //return para quitar el warning
                            },                      
                            (error) => {})
                    },
                    (error) => {this.setState({msgError: "Ya se ha minteado esta imagen"});})}
     };

     onUploadImage = (event) => {
         const reader = new FileReader();
         reader.readAsDataURL(this.fileInput.current.files[0]); //Una vez terminada, el atributo result contiene un data: URL que representa los datos del fichero.
         reader.onloadend = function(e) {                       //Este evento se activa cada vez que la operación de lecura se ha completado (ya sea con éxito o fallo).
             this.setState({imgSrc : [reader.result]})
        }.bind(this);
     };

     onChangeHandler = (event) => {
         let value = event.target.value;
         this.setState({postContent : value})
     }

     onChangeHandler2 = (event) => {
        let value = event.target.value;
        this.setState({postContent2 : value})
    }

    async componentDidMount() {
        await this.loadWeb3();
        await this.loadBlockchainData();

        request('get', `/v1/community/images?page=${this.state.page}`, {},  
            (response) => {
                this.state.images.push.apply(this.state.images, response.data);
                this.setState({images : this.state.images, hideMore : response.data.length === 0});
            },
            (error) => {})

        //MESSAGES
        request('get', `/v1/community/messages?page=${this.state.pageM}`, {}, 
            (response) => {
                this.state.messages.push.apply(this.state.messages, response.data);
                this.setState({messages : this.state.messages, hideMoreM : response.data.length === 0});},
            (error) => {})
     }

     loadMore = (event) => {
        const newPage = this.state.page++;
        this.setState({page : newPage});

        request('get', `/v1/community/images?page=${this.state.page}`, {},  
            (response) => {
                this.setState({images : response.data, hideMore : response.data.length === 0, imgSrc : null});
            },
            (error) => {})

        //MESSAGES
        const newPageM = this.state.pageM++;
        this.setState({pageM : newPageM});

        request("get", `/v1/community/messages?page=${this.state.pageM}`, {}, 
            (response) => {
                this.setState({messages : response.data, hideMoreM : response.data.length === 0});},
            (error) => {})
     }

     onPublishM = e => {
        e.preventDefault();
        if (this.state.postContentM) {
            request("post", "/v1/community/messages", {content : this.state.postContentM},
                   (response) => {
                       const message = response.data;
                       const messages = [message].concat(this.state.messages);
                       this.setState({messages : messages, postContentM : ""});
                       document.getElementById('box3').reset();
                    },
                   (error) => {})
        }
    };

    onChangeHandlerM = (event) => {
        let value = event.target.value;
        this.setState({postContentM : value})
    }

    render() {
        return(
            <div className='principal'>
                <div className='both'>
                    <div className = "box0">  
                        <form id = "box1" className = "box1">
                            <textarea id = "image-post" className = "image-post" placeholder = "Título de la imagen" onChange = {this.onChangeHandler}/>
                            <textarea className = "price" placeholder = "Precio en wei" onChange = {this.onChangeHandler2}/>
                            {this.state.imgSrc && <img className = "image-content" alt = "preview" src = {this.state.imgSrc}/>}
                            <input className = "image-input" ref= {this.fileInput} type = "file" name = "filename" onChange = {this.onUploadImage} accept = "image/gif, image/jpeg, image/png"/>
                            <button className = "box-btn0" onClick ={this.onPublish}>Mintear</button>
                            {this.state.msgError && <p className="error-msg">{this.state.msgError}</p>}
                        </form>
                        {this.state.images.length > 0 && this.state.images.map((image) => <Image key= {image.id} authorId = {image.userDto.id} author = {formatName(image.userDto)} date = {formatDate(image.createdDate)} title = {image.title} price = {image.price} hash = {image.hash} url = {image.path}/>)}
                        {this.state.images.length === 0 && <div></div>}
                        {this.state.images.length > 0 && this.state.images.length % 10 === 0 && 
                            <div>
                                <button className = "box-btn" disabled = {this.state.hideMore} onClick = {this.loadMore}>More</button>
                            </div>} 
                    </div>   

                    <div>
                        <h1 className='notes'>Mis notas</h1>
                        <form id = "box3" className = "box3">
                            <textarea id = "message-post" className = "message-post" placeholder = "Escribe una nota" onChange = {this.onChangeHandlerM}/>
                            <button className = "box-btn0" onClick = {this.onPublishM}>Publicar</button>
                        </form>
                        {this.state.messages.length > 0  && this.state.messages.map((message) => <Message key= {message.id} authorIdM = {message.userDto.id} authorM = {formatName(message.userDto)} dateM = {formatDate(message.createdDate)} contentM = {message.content}/>)}
                        {this.state.messages.length > 0 && this.state.messages.length % 10 === 0 && 
                        <div>
                            <button className = "box-btn" disabled = {this.state.hideMoreM} onClick = {this.loadMoreM}>More</button>
                        </div>}
                        {this.state.messages.length === 0 && <div></div>}
                    </div>                 
                </div>
            </div>
        );
    }
}

export default Images;
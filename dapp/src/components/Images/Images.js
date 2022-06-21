import React from 'react';
import {request, upload} from "../../helpers";
import {formatDate, formatName} from "../Box/Box";
import Image from "./Image";
import Message from "./Message";
import './Images.css';

import BigNumber from "bignumber.js";
import Web3 from 'web3';
import Photo from '../../abis/Photo.json';

import Swal from 'sweetalert2';
import minted from '../../public/Minted.png';

class Images extends React.Component {
     constructor(props) {
         super(props);
         this.state = {
             account: '',
             contract: null,
             images : [],
             postContent : "",
             postContent2 : "",
             hideMore : false,
             imgSrc : null,
             msgError: "",

             messages : [],
             hideMoreM : false,
             postContentM : ""
         }
         this.fileInput = React.createRef();
     }

    async loadWeb3() {
        if (window.ethereum) {
          window.web3 = new Web3(window.ethereum)
          await window.ethereum.request({method: 'eth_requestAccounts'})
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

        var item1 = document.getElementById("image-post").value
        var item2 = document.getElementById("price").value
        if (item1 === "" || item2 === ""){
            Swal.fire({                                                         //position: 'top-end'
                title: "¡Advertencia!",
                text: "Debes rellenar ambos campos para poder hacer el mint.",
                icon: "warning",
                width: "20%",
                backdrop: true
            });
        } else {
            if (this.state.imgSrc) {
                let data = new FormData();
                data.append('file', this.fileInput.current.files[0], this.fileInput.current.files[0].name);    //formData.append(name, value, filename);
                data.append('title', this.state.postContent);
                data.append('price', this.state.postContent2);
                upload("/v1/community/images", data,
                        (response) => {
                            request('get', "/v1/community/images", {},
                                (response) => {
                                    this.setState({images : response.data, hideMore : response.data.length === 0, imgSrc : null, postContent : "", postContent2 : ""});
                                    document.getElementById('box1').reset();
                                    this.state.images.map((image, i) => {
                                        if(i === 0) {
                                            //mint
                                            var BNPrice = new BigNumber(image.price);           
                                            var StringHash = JSON.stringify(image.hash);
                                            this.state.contract.methods.mint(BNPrice, StringHash).send({from: this.state.account})
                                            .once('receipt', (receipt) => {
                                                window.location.reload();
                                            })
                                            .on("transactionHash", async function () {
                                                Swal.fire({                                                    
                                                    title: "Información",
                                                    text: "Espere unos segundos mientras se completa la transacción.",
                                                    icon: "info",
                                                    width: "20%",
                                                    backdrop: true,
                                                    showCancelButton: false, 
                                                    showConfirmButton: false,
                                                    timer: 50000,
                                                    allowEnterKey: false,
                                                    allowEscapeKey: false,
                                                    allowOutsideClick: false
                                                });
                                            })
                                            .on("confirmation", function () {})
                                            .on("error", async function () {
                                                request('delete', "/v1/community/delete", {},
                                                    (response) => {
                                                        this.setState({images : response.data, hideMore : response.data.length === 0, imgSrc : null, postContent : "", postContent2 : ""});
                                                    },                      
                                                    (error) => {})

                                                window.location.reload();
                                            }.bind(this));
                                        }
                                    return true;})
                                },                      
                                (error) => {})
                        },
                        (error) => {})}
        }
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

        request('get', "/v1/community/images", {},
            (response) => {
                this.state.images.push.apply(this.state.images, response.data);
                this.setState({images : this.state.images, hideMore : response.data.length === 0});
            },
            (error) => {})

        //MESSAGES
        request('get', "/v1/community/messages", {}, 
            (response) => {
                this.state.messages.push.apply(this.state.messages, response.data);
                this.setState({messages : this.state.messages, hideMoreM : response.data.length === 0});},
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
            <div>
                <img src={minted} alt="header" width="auto" height="210"/>
                <div className='principal'>
                    <div className='both'>
                        <div className = "box0">  
                            <form id = "box1" className = "box1">
                                <textarea id = "image-post" className = "image-post" placeholder = "Título de la imagen" onChange = {this.onChangeHandler} required/>
                                <input type="number" id = "price" className = "price" placeholder = "Precio en Wei" onChange = {this.onChangeHandler2} required/>
                                {this.state.imgSrc && <img className = "image-content2" alt = "preview" src = {this.state.imgSrc}/>}
                                                           
                                <div className="container-input">
                                    <input type="file" id="file-1" className="inputfile inputfile-1" ref= {this.fileInput} onChange = {this.onUploadImage} accept = "image/gif, image/jpeg, image/png" data-multiple-caption="{count} archivos seleccionados" multiple />
                                    <label htmlFor="file-1">
                                        <svg className="iborrainputfile" width="18" height="13" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"></path></svg>
                                        <span className="iborrainputfile">Seleccionar archivo</span>
                                    </label>
                                </div>
                               
                                <input type="submit" value="Mintear" className = "box-btn0" onClick ={this.onPublish}/>
                                {this.state.msgError && <p className="error-msg">{this.state.msgError}</p>}
                            </form>
                            {this.state.images.length > 0 && this.state.images.map((image) => <Image key= {image.id} authorId = {image.userDto.id} author = {formatName(image.userDto)} date = {formatDate(image.createdDate)} title = {image.title} price = {image.price} hash = {image.hash} url = {image.path}/>)}
                            {this.state.images.length === 0 && <div></div>}
                        </div>   

                        <div>
                            <h1 className='notes'>Mis notas</h1>
                            <form id = "box3" className = "box3">
                                <textarea id = "message-post" className = "message-post" placeholder = "Escribe una nota" onChange = {this.onChangeHandlerM}/>
                                <button className = "box-btn0" onClick = {this.onPublishM}>Publicar</button>
                            </form>
                            {this.state.messages.length > 0  && this.state.messages.map((message) => <Message key= {message.id} authorIdM = {message.userDto.id} authorM = {formatName(message.userDto)} dateM = {formatDate(message.createdDate)} contentM = {message.content}/>)}
                            {this.state.messages.length === 0 && <div></div>}
                        </div>                 
                    </div>
                </div>
            </div>
        );
    }
}

export default Images;
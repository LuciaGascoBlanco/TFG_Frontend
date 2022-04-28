import * as React from "react";
import {request} from "../../helpers";
import Web3 from 'web3';
import Photo from '../../abis/Photo.json';
import BigNumber from "bignumber.js";
import Swal from 'sweetalert2';

class Image extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
             account: '',
             contract: null,
             authorId : props.authorId,
             author : props.author,
             date : props.date,
             title : props.title,
             price : props.price,
             hash : props.hash,
             url : props.url,
             disabled : false
        }
        this.purchase = this.purchase.bind(this);         
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

    toBuy = (e) => {
        e.preventDefault();

        var StringHash = JSON.stringify(this.state.hash);
        var BNPrice = new BigNumber(this.state.price);
        this.purchase(BNPrice, StringHash, e);
    }

    async purchase(price, photo, e) {
        e.preventDefault();
        await this.loadWeb3();
        await this.loadBlockchainData();

        var t = true;
        this.state.contract.methods.purchase(photo).send({from: this.state.account, value: price})
            .once('receipt', (receipt) => {console.log("Receipt");}) 
            .on("transactionHash", function () {

                //subir la cuenta a la BBDD
                let data1 = new FormData();
                data1.append('hash', this.state.hash);
                data1.append('account2', this.state.account);
                request('post', "/v1/community/accountBuyer", data1,
                        (response) => {},
                        (error) => {})

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
            }.bind(this))
            .on("error", async function () {
                window.location.reload();})
            .on("confirmation", async function () {console.log("Confirmed");
                if(t) {
                    let data = new FormData();                              
                    data.append('hash', this.state.hash);

                    request('post', "/v1/community/imageSold", data,        //Post-imageSold (para luego descargar desde sold)
                        (response) => {console.log("responseSold")},
                        (error) => {console.log("errorSold")})

                    request('delete', "/v1/community/delete2", data,            //Delete2 (foto de la galería)
                        (response) => {console.log("responseDelete2")},                      
                        (error) => {console.log("errorDelete2")})
                    
                    t = false;

                    window.location.reload();
                }
            }.bind(this));
    }

    render() {
        return (
            <section className = "image-gallery">
                <div className = "image-gallery-header">
                    <div className = "image-title">{this.state.title + " - "}</div>
                    <div className = "price">{this.state.price + " Wei"}</div>
                    <div className = "box-date">{this.state.date}</div>
                </div>
                <img className = "image-content" alt = {this.state.title} src = {`data:image/jpg;base64,${this.state.url}`}/>
                <div className="image-gallery-bottom">
                    <div className = "box-author">{this.state.author}</div>
                    <button className = "box-btn" onClick ={this.toBuy}>Comprar</button>
                </div>
            </section>
        )
    }
}

export default Image;
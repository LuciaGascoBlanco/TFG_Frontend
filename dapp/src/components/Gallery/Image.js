import * as React from "react";
import {Link} from "react-router-dom";
import {request} from "../../helpers";
import Web3 from 'web3';
import Photo from '../../abis/Photo.json';
import BigNumber from "bignumber.js";

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
        //this.purchase = this.purchase.bind(this); 
        this.toBuy = this.toBuy.bind(this);           
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
            console.log(contract)        
          } else {window.alert('Smart contract not deployed to detected network.')}
    }

    /*toBuy = (e) => {
        e.preventDefault();
        var StringHash = JSON.stringify(this.state.hash);
        var BNPrice = new BigNumber(this.state.price);
        this.purchase(BNPrice, StringHash, e);
    }

    async purchase(price, photo, e) {
        e.preventDefault();
        await this.loadWeb3();
        await this.loadBlockchainData();
        this.state.contract.methods.purchase(photo).send({from: this.state.account, value: price})
            .once('receipt', (receipt) => {console.log("Ha hecho la compra");}) 
            .on("transactionHash", function () {console.log("Hash")})
            .on("receipt", function () {console.log("Receipt");})
            .on("confirmation", function () {
                console.log("Confirmed");
                {this.props.receiveProps(this.state.authorId, this.state.author, this.state.date, this.state.title, this.state.price, this.state.hash, this.state.url)}
                //{this.setState({disabled: true})}         //algo asi para hacer que desaparezca la foto de aqui
            })
            .on("error", async function () {console.log("Error");});
    }*/

    toBuy(e) {
        e.preventDefault();
        console.log("hash: ", this.state.hash);

            let data = new FormData();
            data.append('hash', this.state.hash);
            request('post', "/v1/community/imageSold", data,
                (response) => {},
                (error) => {})
    }

    render() {
        return (
            <section className = "image-gallery">
                <div className = "image-gallery-header">
                    <div className = "image-title">{this.state.title + " - "}</div>
                    <div className = "price">{this.state.price + " wei"}</div>
                    <div className = "box-date">{this.state.date}</div>
                </div>
                <img className = "image-content" alt = {this.state.title} src = {`data:image/jpg;base64,${this.state.url}`}/>
                <div className="image-gallery-bottom">
                    <Link to ={`/users/${this.state.authorId}`} className = "box-author">{this.state.author}</Link>
                    <button className = "box-btn" onClick ={this.toBuy}>Comprar</button>
                </div>
            </section>
        )
    }
}

export default Image;
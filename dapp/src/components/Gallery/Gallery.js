import React from 'react';
import {request} from "../../helpers";
import {formatDate, formatName} from "../Box/Box";
import Image from "./Image";
import './Gallery.css';
import photo from '../../public/Portada.png';

import Web3 from 'web3'
import Photo from '../../abis/Photo.json'

class Gallery extends React.Component {
     constructor(props) {
         super(props);
         this.state = {
             account: '',
             contract: null,
             images : [],
             page : 0,
             hideMore : false
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
        } else {
            window.alert('Smart contract not deployed to detected network.')
        }
    }

    async componentDidMount() {
        await this.loadWeb3();
        await this.loadBlockchainData();

        request('get', `/v1/community/gallery?page=${this.state.page}`, {},  
            (response) => {
                this.state.images.push.apply(this.state.images, response.data);
                this.setState({images : this.state.images, hideMore : response.data.length === 0});
            },
            (error) => {})
     }

    render() {
        return(
            <div>
                <img src={photo} alt="header" width="auto" height="210"/>               
                <div className = "gallery-body"> {this.state.images.length > 0 && this.state.images.map((image) => <Image key= {image.id} authorId = {image.userDto.id} author = {formatName(image.userDto)} date = {formatDate(image.createdDate)} title = {image.title} price = {image.price} hash = {image.hash} url = {image.path} />)} </div>
                {this.state.images.length === 0 && <div></div>}               
            </div>
        );
    }
}

export default Gallery;
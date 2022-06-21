import * as React from "react";
import './../Gallery/Gallery.css';
import {request} from "../../helpers";
import {formatDate, formatName} from "../Box/Box";
import Web3 from 'web3';
import Photo from '../../abis/Photo.json';

var image = {};
var hash;

class History extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            account: '',
            contract: null,
            imagesArray: [],
            accountMinter: "",
            accountBuyer: "",
            hash: props.item
        }
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

    async componentDidMount() {
        await this.loadWeb3();
        await this.loadBlockchainData();

        if(typeof this.state.hash === 'string' || this.state.hash instanceof String) {hash = this.state.hash} 
        else {hash = window.localStorage.getItem('hash');}                  //Para que se guarde al recargar la página

        var StringHash = JSON.stringify(hash);
        var prueba = await this.state.contract.methods.getUsers(StringHash).call();

        this.setState({accountMinter: prueba.seller});
        this.setState({accountBuyer: prueba.buyer});
            
        request('get', "/v1/community/imageSold", {},
            (response) => {
                this.state.imagesArray.unshift.apply(this.state.imagesArray, response.data);
                this.setState({imagesArray: this.state.imagesArray})
            },
            (error) => {})
    }

    render() {
        image = JSON.parse(window.localStorage.getItem('image'));
        return (
            <div>
                {this.state.imagesArray.map((image0) => {
                    if(image0.hash === this.state.hash) {                           //Guardar en el localStorage para que no se pierda al recargar
                        window.localStorage.setItem('image', JSON.stringify(image0));
                        image = JSON.parse(window.localStorage.getItem('image'));
                        window.localStorage.setItem('hash', this.state.hash);  
                        console.log(image0);         
                    }return true;})}
                <div className="flexHistory">
                    <div className="image-body">
                        <section className="image-gallery">
                                <div className = "image-gallery-header">
                                    <div className = "image-title">{image.title}</div>
                                </div>
                                <img id = "image-content" className = "image-content1" alt = {image.title} src = {`data:image/jpg;base64,${image.path}`}/>
                        </section>
                    </div>
                    <div className="flexTables">
                        <table className="table" border="1" cellSpacing="0">
                            <caption className="caption">Historial de transacciones</caption>
                            <thead className="thread">
                                <tr className="tr">
                                    <th className="th1"> De </th>
                                    <th className="th2"> Para </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className = "rows">
                                    <td className="td1">{formatName(image.userDtoMinter)} - {this.state.accountMinter}</td>
                                    <td className="td2">{formatName(image.userDto)} - {this.state.accountBuyer}</td>
                                </tr>
                                <tr className = "rows">
                                    <td className="td1">{formatName(image.userDtoMinter)} - {this.state.accountMinter}</td>
                                    <td className="td2">{"-"}</td>
                                </tr>
                            </tbody>
                        </table>

                        <table className="table2" border="1" cellSpacing="0">
                            <thead className="thread">
                                <tr className="tr">
                                    <th className="th3"> Cantidad (Wei)</th>
                                    <th className="th4"> Fecha de creación </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className = "rows">
                                    <td rowSpan="2" className="td3">{image.price}</td>
                                    <td rowSpan="2" className="td4">{formatDate(image.createdDate)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>                 
        )
    }
}

export default History;
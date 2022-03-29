import React from "react";
import {Link} from "react-router-dom";
import {withRouter} from "react-router-dom";
import "./RegularLayout.css"
import {request, setAuthHeader} from "../helpers";
import PropTypes from "prop-types";
import Web3 from 'web3';
import Photo from '../abis/Photo.json';
import Logo from '../public/Logo.png';

class RegularLayout extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            account: '',
            contract: null,
        }
    }

    static propTypes = {
        history: PropTypes.object.isRequired
    };

    async componentDidMount() {
        await this.loadWeb3();
        await this.loadBlockchainData();
    }

    onLogout = e => {
        e.preventDefault();
        request('post', '/v1/signOut', {},
                (response) => {
                    setAuthHeader('');
                    this.props.history.push('/login');
                },
                (error) => {})
    };

    async loadWeb3() {
        if (window.ethereum) {
          window.web3 = new Web3(window.ethereum)
          await window.ethereum.enable()
        }
        else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider)
        }
        else {
          window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
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

    render() {
        return (
            <div className="regular-layout">
                <div className="regular-layout-body">
                    <div className="regular-head">
                        <img className="regular-title" src={Logo} width="auto" alt="logo" height="40"/>
                        <div className="tabs">
                            <Link to={"/home"} className="tab">Home</Link>
                            <Link to={"/images"} className="tab">Perfil</Link>
                            <Link to={"/gallery"} className="tab">Galería</Link>
                            <Link to={"/sold"} className="tab">Comprados</Link>
                            <Link to={"/login"} className="tab">Logout</Link>
                            <div className="account">{this.state.account}</div>
                        </div>
                    </div>
                    <div className="regular-content">
                        {this.props.children}
                    </div>
                    <footer className="footer"><div>© 2022 Marca registrada - NFT's art gallery</div></footer>
                </div>
            </div>
        );
    }
}

export default withRouter(RegularLayout);
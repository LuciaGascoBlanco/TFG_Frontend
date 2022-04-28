import * as React from "react";
import './../Gallery/Gallery.css';
import {request} from "../../helpers";
import {formatDate, formatName} from "../Box/Box";

var image = {};
var hash;

class History extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            imagesArray: [],
            accountMinter: "",
            accountBuyer: "",
            name: "",
            hash: props.item
        }
    }

    componentDidMount() {

        if(typeof this.state.hash === 'string' || this.state.hash instanceof String) {hash = this.state.hash} 
        else {hash = window.localStorage.getItem('hash');}                  //Para que se guarde al recargar la página

            let data1 = new FormData();
            data1.append('hash', hash);

            request('post', "/v1/community/getAccountMinter", data1,
                (response) => {
                    this.setState({accountMinter: response.data})
                },
                (error) => {}) 

            request('post', "/v1/community/getAccountBuyer", data1,
            (response) => {
                this.setState({accountBuyer: response.data})
            },
            (error) => {})

            request('post', "/v1/community/getMinter", data1,
            (response) => {
                this.setState({name: formatName(response.data)})
            },
            (error) => {}) 
            
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
                                    <td className="td1">{this.state.name} - {this.state.accountMinter}</td>
                                    <td className="td2">{formatName(image.userDto)} - {this.state.accountBuyer}</td>
                                </tr>
                                <tr className = "rows">
                                    <td className="td1">{this.state.name} - {this.state.accountMinter}</td>
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
                                    <td ROWSPAN="2" className="td3">{image.price}</td>
                                    <td ROWSPAN="2" className="td4">{formatDate(image.createdDate)}</td>
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
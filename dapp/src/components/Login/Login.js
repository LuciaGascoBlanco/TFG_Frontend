import React from 'react';
import './Login.css'
import PropTypes from "prop-types";
import classNames from 'classnames';
import {request} from "../../helpers";
import {withRouter} from "react-router-dom";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationCircle} from "@fortawesome/free-solid-svg-icons";
import mobile from '../../public/Movil.png';
import logo from '../../public/Logo.png';

class Login extends React.Component {

    static propTypes = {
        history : PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            login: "",
            password: "",
            tabToShow: "signIn",
            msgError: ""
        };
    };

    onChangeHandler = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({[name] : value});
    }

    onSwitchTab = (tab) => {
        this.setState({tabToShow: tab});
    }

    onSubmitSignIn = (e) => {
        e.preventDefault();
        if (this.state.login && this.state.password) {
            request('post', '/v1/signIn', {login : this.state.login, password : this.state.password },
                    (response) => {
                        this.props.history.push("/home");
                        this.setState({msgError: ''});
                    },
                    (error) => {
                        this.setState({msgError: error.response.data.message});
                    })
        }
    }

    onSubmitSignUp = (e) => {
        e.preventDefault();
        if (this.state.firstName && this.state.lastName && this.state.login && this.state.password) {
            request('post', '/v1/signUp', {firstName : this.state.firstName, lastName : this.state.lastName, login : this.state.login, password : this.state.password},
                    (response) => {
                        this.onSwitchTab("signIn");
                        this.setState({msgError: ''});
                    },
                    (error) => {
                        this.setState({msgError: error.response.data.message});
                    })
        }
    }

    render() {
        return (
            <div className='loginFlex'>
                <img src={mobile} className="mobile-photo" alt="header" width="auto" height="610"/>
                <div className='loginFlexColumn'>
                <img src={logo} className="logo" alt="header" width="auto" height="35"/>
                    <div className="login-popin">
                        <div className="tabs">
                            <div className={classNames("login-tab", this.state.tabToShow === "signIn" ? "selected" : "")} onClick={() => this.onSwitchTab("signIn")}>Iniciar sesión</div>
                            <div className={classNames("login-tab", this.state.tabToShow === "signUp" ? "selected" : "")} onClick={() => this.onSwitchTab("signUp")}>Registrarse</div>
                        </div>
                        <div className="sign-in" style={{display: this.state.tabToShow === "signIn" ? "block" : "none"}}>
                            <form onSubmit={this.onSubmitSignIn}>
                                <p>
                                    <label className='login' htmlFor="login">Login: </label>
                                    <input name="login" type="text" onChange={this.onChangeHandler}/>
                                </p>
                                <p>
                                    <label className='password' htmlFor="password">Password: </label>
                                    <input name="password" type="password" onChange={this.onChangeHandler}/>
                                </p>
                                <p>
                                    <button className="submit-btn" type="submit">Acceder</button>
                                </p>
                                <div>
                                    {this.state.msgError && 
                                        <div className='iconFlex'>
                                            <FontAwesomeIcon className='icon' icon={faExclamationCircle}/>
                                            <p className="error-msg">{this.state.msgError}</p>
                                        </div>}
                                </div>
                            </form>
                        </div>
                        <div className="sign-up" style={{display: this.state.tabToShow === "signUp" ? "block" : "none"}}>
                            <form onSubmit={this.onSubmitSignUp}>
                                <p>
                                    <label className='firstName' htmlFor="firstName">Nombre: </label>
                                    <input name="firstName" type="text" onChange={this.onChangeHandler}/>
                                </p>
                                <p>
                                    <label className='lastName' htmlFor="lastName">Apellidos: </label>
                                    <input name="lastName" type="text" onChange={this.onChangeHandler}/>
                                </p>
                                <p>
                                    <label className='login' htmlFor="login">Login: </label>
                                    <input name="login" type="text" onChange={this.onChangeHandler}/>
                                </p>
                                <p>
                                    <label className='password' htmlFor="password">Password: </label>
                                    <input name="password" type="password" onChange={this.onChangeHandler}/>
                                </p>
                                <p>
                                    <button className="submit-btn" type="submit">Registrarse</button>
                                </p>
                                <div>
                                    {this.state.msgError && 
                                        <div className='iconFlex'>
                                            <FontAwesomeIcon className='icon' icon={faExclamationCircle}/>
                                            <p className="error-msg">{this.state.msgError}</p>
                                        </div>}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default withRouter(Login);
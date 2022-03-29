import React from 'react';
import './Login.css'
import PropTypes from "prop-types";
import classNames from 'classnames';
import {request} from "../../helpers";
import {withRouter} from "react-router-dom";

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
            request('post', '/v1/signIn',
                    {login : this.state.login, password : this.state.password },
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
            request('post', '/v1/signUp',
                    {firstName : this.state.firstName, lastName : this.state.lastName, login : this.state.login, password : this.state.password},
                    (response) => {
                        this.onSwitchTab("signIn");
                        console.log(response);
                        this.setState({msgError: ''});
                    },
                    (error) => {
                        console.log(error.response);
                        this.setState({msgError: error.response.data.message});
                    })
        }
    }

    render() {
        return (<div className="login-popin">
            <div className="tabs">
                <div className={classNames("login-tab", this.state.tabToShow === "signIn" ? "selected" : "")} onClick={() => this.onSwitchTab("signIn")}>Sign In</div>
                <div className={classNames("login-tab", this.state.tabToShow === "signUp" ? "selected" : "")} onClick={() => this.onSwitchTab("signUp")}>Sign Up</div>
            </div>
            <div className="sign-in" style={{display: this.state.tabToShow === "signIn" ? "block" : "none"}}>
                <form onSubmit={this.onSubmitSignIn}>
                    <p>
                        <label htmlFor="login">Login: </label>
                        <input name="login" type="text" onChange={this.onChangeHandler}/>
                    </p>
                    <p>
                        <label htmlFor="password">Password: </label>
                        <input name="password" type="password" onChange={this.onChangeHandler}/>
                    </p>
                    <p>
                        <button className="submit-btn" type="submit">Submit</button>
                    </p>
                    {this.state.msgError && <p className="error-msg">{this.state.msgError}</p>}
                </form>
            </div>
            <div className="sign-up" style={{display: this.state.tabToShow === "signUp" ? "block" : "none"}}>
                <form onSubmit={this.onSubmitSignUp}>
                    <p>
                        <label htmlFor="firstName">First Name: </label>
                        <input name="firstName" type="text" onChange={this.onChangeHandler}/>
                    </p>
                    <p>
                        <label htmlFor="lastName">Last Name: </label>
                        <input name="lastName" type="text" onChange={this.onChangeHandler}/>
                    </p>
                    <p>
                        <label htmlFor="login">Login: </label>
                        <input name="login" type="text" onChange={this.onChangeHandler}/>
                    </p>
                    <p>
                        <label htmlFor="password">Password: </label>
                        <input name="password" type="password" onChange={this.onChangeHandler}/>
                    </p>
                    <p>
                        <button className="submit-btn" type="submit">Submit</button>
                    </p>
                    {this.state.msgError && <p className="error-msg">{this.state.msgError}</p>}
                </form>
            </div>
        </div>)
    }

}

export default withRouter(Login);
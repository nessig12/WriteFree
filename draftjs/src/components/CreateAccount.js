import React from 'react';
import request from 'request';
import { Input, Button, Card } from 'antd';
import 'antd/dist/antd.css';
import {withRouter} from "react-router-dom";
import Cookies from 'universal-cookie';
import { GoogleLogin } from 'react-google-login';
import GoogleButton from 'react-google-button';
import Alert from 'react-s-alert';
import {handleAccountError} from "../constants";

class CreateAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: null,
            fullName: null,
            password: null
        };
    }
    createAccount(email, fullName, password) {
        var postCreateAnAccountInformation = {
            method: 'POST',
            url: 'http://127.0.0.1:5000/create-account',
            qs: { email, fullName, password },
            headers: {'Content-Type': 'application/x-www-form-urlencoded' }
        };
        request(postCreateAnAccountInformation, function (error, response, body) {
            if (response.statusCode === 401){
                /* TODO in backend:
                   -is email valid
                   -is email duplicate
                   -is fullName valid
                   -is password valid
                 */
                handleAccountError(error)
            } else {
                const parsedData = JSON.parse(body)
                localStorage.setItem("email", email);
                localStorage.setItem("access_token", parsedData.access_token);
                localStorage.setItem("id", parsedData.access_token);
                localStorage.setItem("refresh_token", parsedData.refresh_token);
                this.props.history.push("/default-settings")
            }
        }.bind(this));
    }

    googleSignUp(response) {
        var email = response.profileObj.email;
        var google_id = (response.profileObj.googleId).toString();
        var name = (response.profileObj.name).toString();
        var postLoginInformation = {
            method: 'POST',
            url: 'http://127.0.0.1:5000/create-account-google',
            qs:{email, google_id, name},
            headers: {'Content-Type': 'application/x-www-form-urlencoded' }
        };
        request(postLoginInformation, function (error, response, body) {
            if (response.statusCode === 401){
                /* TODO in backend:
                   -is email valid
                   -is email duplicate
                   -is fullName valid
                   -is password valid
                 */
                handleAccountError(error)
            } else {
                const parsedData = JSON.parse(body);
                localStorage.setItem("email", email);
                localStorage.setItem("access_token", parsedData.access_token);
                localStorage.setItem("id", parsedData.access_token);
                localStorage.setItem("refresh_token", parsedData.refresh_token);
                this.props.history.push("/default-settings")
            }
        }.bind(this));
    }

    render() {
        return (
            <div>
                <Alert stack={true} timeout={3000} />
                <Card
                    title="Create An Account"
                    style={{ width: 400 }}
                >
                    <Input placeholder="Email" onChange={email => this.setState({email: email.target.value})}/> <br/>
                    <Input placeholder="Full Name" onChange={fullName => this.setState({fullName: fullName.target.value})}/> <br/>
                    <Input placeholder="Password" type="password" onChange={password => this.setState({password: password.target.value})}/> <br/>
                    <Button type="primary" onClick={() => this.createAccount(this.state.email, this.state.fullName, this.state.password)}>Sign Up</Button><br/>
                    <Card>
                        <p>Have an account? <a onClick={() => this.props.history.push("/login")}> Login </a> </p>
                    </Card>
                    <GoogleLogin
                        clientId="402919311024-18n9b01dptgeg774297fp4u9ir18sb6g.apps.googleusercontent.com"
                        onSuccess={(succ) => this.googleSignUp(succ)}
                        onFailure={(fail) => this.googleSignUp(fail)}
                        style={{
                            border: 'none',
                            background: 'none',
                            padding: 0,
                            margin: 0
                        }}
                    >
                        <GoogleButton label= "Sign up With Google"/>
                    </GoogleLogin>
                </Card>
            </div>
        )
    }
}

export default withRouter(CreateAccount);

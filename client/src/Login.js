import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, onValue} from "firebase/database";
import { sha256 } from './utils';

class LoginClass extends Component {
    constructor(props){
        super(props);
        this.users = {};
        const usersRef = ref(this.props.db, 'users/');
        onValue(usersRef, (snapshot) => {
            this.users = snapshot.val();
        });
        this.state = {username: "", password: ""};
    }

    handleChange = event => this.setState({ [event.target.name]: event.target.value});

    handleLogin = () => {
        const { username, password } = this.state;
        if (!this.users.hasOwnProperty(username) || this.users[username].password !== sha256(password)) {
            alert("Incorrect username and/or password");
            return;
        }
        this.props.navigate("/user/" + username);
        window.location.reload(false);
    }

    redirectToOnboard = () => {
        this.props.navigate("/newuser");
        window.location.reload(false);
    }

    render() {
        return (
            <div>
                <label>
                    {"Username: "}
                    <input
                      name = 'username'
                      onChange={this.handleChange}
                      placeholder="Enter username"
                      value={this.state.username} />
                </label>
                <br />
                <label>
                    {"Password: "}
                    <input
                      name = 'password'
                      type = 'password'
                      onChange={this.handleChange}
                      placeholder="Enter password"
                      value={this.state.password} />
                </label>
                <br />
                <button onClick={this.handleLogin}>Login</button>
                <button onClick={this.redirectToOnboard}>Create Account</button>
            </div>
        );
    }
}

export default function Login(props) {
    return <LoginClass db = {props.db} navigate = {useNavigate()} />;
}
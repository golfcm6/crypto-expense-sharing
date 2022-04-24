import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, set, onValue} from "firebase/database";
import { isHexadecimal, sha256 } from './utils';

class OnboardClass extends Component {
    constructor(props){
        super(props);
        this.users = [];
        const usersRef = ref(this.props.db, 'users/');
        onValue(usersRef, (snapshot) => {
            this.users = Object.keys(snapshot.val());
        });
        this.state = {username: "", name: "", address: "", password: "", password2: ""};
    }

    handleChange = event => this.setState({ [event.target.name]: event.target.value});

    isValidAddress = address => (address.length === 42) && (address.slice(0, 2) === "0x") &&
                        isHexadecimal(address.slice(2));

    createAccount = () => {
        if (this.state.password !== this.state.password2) {
            alert("Passwords don't match");
            return;
        }
        if (!this.isValidAddress(this.state.address)) {
            alert("Invalid Wallet Address");
            return;
        }
        if (this.users.includes(this.state.username)) {
            alert("This username is already in use");
            return;
        }

        set(ref(this.props.db, 'users/' + this.state.username), {
            name: this.state.name,
            address: this.state.address,
            password: sha256(this.state.password),
            groups: []
        });
        this.props.navigate("/user/" + this.state.username);
        window.location.reload(false);
    }

    render() {
        return (
            <div>
                <label>
                    {"Name: "}
                    <input
                      name = 'name'
                      onChange={this.handleChange}
                      placeholder="Enter name"
                      value={this.state.name} />
                </label>
                <br />
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
                <label>
                    {"Confirm Password: "}
                    <input
                      name = 'password2'
                      type = 'password'
                      onChange={this.handleChange}
                      placeholder="Re-enter password"
                      value={this.state.password2} />
                </label>
                <br />
                <label>
                    {"Wallet Address: "}
                    <input
                      name = 'address'
                      onChange={this.handleChange}
                      placeholder="Enter wallet address"
                      value={this.state.address} />
                </label>
                <br />
                <button onClick={this.createAccount}>Create Account</button>
            </div>
        );
    }
}

export default function Onboard(props) {
    return <OnboardClass db = {props.db} navigate = {useNavigate()} />;
}
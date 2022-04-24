import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, set, push, child, onValue } from "firebase/database";

class NewGroupClass extends Component {
    constructor(props){
        super(props);
        this.users = [];
        const usersRef = ref(this.props.db, 'users/');
        onValue(usersRef, (snapshot) => {
            this.users = Object.keys(snapshot.val());
        });
        this.state = {groupName: "", members: [], currentUser: ""};
    }

    handleChange = event => this.setState({[event.target.name]: event.target.value});

    addMember = _event => {
        const username = this.state.currentUser;
        if (!this.users.includes(username)) {
            alert("There is no user with this username");
            return;
        }
        this.setState({members: [...this.state.members, username], currentUser: ""});
    } 

    createGroup = () => {
        if (this.state.currentUser) {
            alert(this.state.currentUser + " has not been added to the group");
            return;
        }
        const newGroupID = push(child(ref(this.props.db), 'groups')).key;
        set(ref(this.props.db, 'groups/' + newGroupID), {
            name: this.state.groupName,
            members: this.state.members
        });
        this.props.navigate("/group/" + newGroupID);
        window.location.reload(false);
    }

    render() {
        const members = this.state.members.map((el, i) => <div key={i}>{el}</div>);
        return (
            <div>
                <label>
                    {"Group Name: "}
                    <input
                      name = 'groupName'
                      onChange={this.handleChange}
                      placeholder="Enter group name"
                      value={this.state.groupName} />
                </label>
                <br />
                <h2>{"Group Members: "}</h2>
                <div>
                    {members}
                </div>
                <br />
                <div>
                    <input
                      name = 'currentUser'
                      onChange={this.handleChange}
                      placeholder="Enter username"
                      value={this.state.currentUser} />
                    <button onClick={this.addMember}>Add member</button>
                </div>
                <button onClick={this.createGroup}>Create Group</button>
            </div>
        );
    }
}

export default function NewGroup(props) {
    return <NewGroupClass db = {props.db} navigate = {useNavigate()} />;
}
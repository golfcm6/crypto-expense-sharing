import React, { Component } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { ref, onValue} from "firebase/database";

class HomepageClass extends Component {
    constructor(props){
        super(props);
        this.state = {user: {}, groups: {}};
        const userRef = ref(this.props.db, 'users/' + this.props.username);
        onValue(userRef, (snapshot) => {
            this.setState({user: snapshot.val()});
        });
        const groupRef = ref(this.props.db, 'groups/');
        onValue(groupRef, (snapshot) => {
            this.setState({groups: snapshot.val()});
        });
    }

    redirectToNewGroup = () => {
        this.props.navigate("/newgroup");
        window.location.reload(false);
    }

    render() {
        const userGroups = this.state.user.groups || [];
        const groupList = Object.entries(this.state.groups)
                                .filter(([key, _val]) => userGroups.includes(key))
                                .map(([_key, val], i) => <h3 key={i}>{val.name}</h3>);

        return (
            <div>
                {userGroups.length > 0 && (
                <div>
                    <h2>Groups</h2>
                    {groupList}
                </div>)}
                <button onClick={this.redirectToNewGroup}>Create New Group</button>
            </div>
        );
    }
}

export default function Homepage(props) {
    let { username } = useParams();
    return <HomepageClass db = {props.db} navigate = {useNavigate()} username = {username} />;
}
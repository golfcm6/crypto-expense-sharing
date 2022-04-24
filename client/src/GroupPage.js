import React, { Component } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ref, onValue} from "firebase/database";
import RecordDisplay from "./RecordDisplay";

class GroupPageClass extends Component {
    constructor(props){
        super(props);
        this.state = {group: {}, transactions: {}};
        const transactionsRef = ref(this.props.db, 'transactions/');
        onValue(transactionsRef, (snapshot) => {
            this.setState({transactions: snapshot.val()});
        });
        const groupRef = ref(this.props.db, 'groups/' + this.props.groupID);
        onValue(groupRef, (snapshot) => {
            console.log(snapshot.val());
            this.setState({group: snapshot.val()});
        });
    }

    redirectToNewTransaction = () => {
        this.props.navigate("/newtransaction/" + this.props.groupID);
        window.location.reload(false);
    }

    triggerContract = () => {
        if (!this.state.group.transactions || !this.state.group.transactions.length) {
            alert("No transactions to process");
            return;
        }
        const groupTransactions = this.state.group.transactions;
        const filteredTransactions = Object.entries(this.state.transactions)
                                   .filter(([key, _val]) => groupTransactions.includes(key))
                                   .map(([_key, val]) => val);
        const final = {};
        for (const transaction of filteredTransactions) {
            for (const [key, val] of Object.entries(transaction.bill)) {
                if (!final.hasOwnProperty(key)) final[key] = 0;
                final[key] -= val;
            }
            for (const [key, val] of Object.entries(transaction.payRecord)) {
                if (!final.hasOwnProperty(key)) final[key] = 0;
                final[key] += val;
            }
        }
        console.log(final);
        alert("Activate distribution smart contract");
    }

    render() {
        console.log(this.state.transactions);
        const groupMembers = this.state.group.members || [];
        const groupTransactions = this.state.group.transactions || [];
        const membersList = groupMembers.map((el, i) => <h3 key={i}>{el}</h3>);
        const transactions = Object.entries(this.state.transactions)
                                   .filter(([key, _val]) => groupTransactions.includes(key))
                                   .map(([_key, val]) => val);
        const transactionsList = transactions.map((el, i) => <RecordDisplay key={i} transaction = {el}/>);

        return (
            <div>
                {groupMembers.length > 0 && (
                <div>
                    <h2>Group Members</h2>
                    {membersList}
                </div>)}
                {transactions.length > 0 && (
                <div>
                    <h2>Transactions</h2>
                    {transactionsList}
                </div>)}
                <button onClick={this.redirectToNewTransaction}>Add New Transaction</button>
                <button onClick={this.triggerContract}>Propose Distribution</button>
            </div>
        );
    }
}

export default function GroupPage(props) {
    let { groupID } = useParams();
    return <GroupPageClass db = {props.db} navigate = {useNavigate()} groupID = {groupID} />;
}
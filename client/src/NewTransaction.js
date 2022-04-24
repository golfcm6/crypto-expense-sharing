import React, { Component } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { onValue, ref, push, set, child, update } from "firebase/database";

import Record from "./Record";
import { EQUALITY_THRESHOLD } from "./constants";

class NewTransactionClass extends Component {
    constructor(props){
        super(props);
        this.state = {
            name: "",
            bill: {},
            payRecord: {},
            transactions: []
        };
        const groupRef = ref(this.props.db, 'groups/' + this.props.groupID);
        onValue(groupRef, (snapshot) => {
            const group = snapshot.val();
            this.setState({transactions: group.hasOwnProperty("transactions") ? group.transactions : []});
            if (!group.members) return;
            this.setState({groupMembers: group.members});
            for (const member of group.members) {
                if (!this.state.bill.hasOwnProperty(member)) {
                    this.state.bill[member] = "";
                }
                if (!this.state.payRecord.hasOwnProperty(member)) {
                    this.state.payRecord[member] = "";
                }
            }
        });
    };

    handleChange = event => this.setState({[event.target.name]: event.target.value});

    setBillAmounts = (member, val) => {
        this.setState({bill: {...this.state.bill, [ member ]: val}});
    };

    setPayAmounts = (member, val) => {
        this.setState({payRecord: {...this.state.payRecord, [ member ]: val}});
    }

    submitTransaction = () => {
        if (!this.state.name) {
            alert("Please enter a transaction name");
            return;
        }
        var totalBill = 0;
        var totalPaid = 0;
        const cleanedUpBill = {};
        const cleanedUpPayRecord = {};
        for (const [member, val] of Object.entries(this.state.bill)) {
            if (isNaN(val) || (+val) < 0) {
                alert("Please enter a non-negative numeric value for " + member + " on the bill");
                return;
            }
            cleanedUpBill[member] = +val;
            totalBill += cleanedUpBill[member];
        }
        for (const [member, val] of Object.entries(this.state.payRecord)) {
            if (isNaN(val) || (+val) < 0) {
                alert("Please enter a non-negative numeric value for " + member + " on the pay record");
                return;
            }
            cleanedUpPayRecord[member] = +val;
            totalPaid += cleanedUpPayRecord[member];
        }
        if (Math.abs(totalBill - totalPaid) >= EQUALITY_THRESHOLD) {
            alert("Bill total does not match payment total");
            return;
        }
        const newTransactionID = push(child(ref(this.props.db), 'transactions')).key;
        set(ref(this.props.db, 'transactions/' + newTransactionID), {
            bill: cleanedUpBill,
            payRecord: cleanedUpPayRecord,
            name: this.state.name,
            groupID: this.props.groupID
        });
        update(ref(this.props.db, 'groups/' + this.props.groupID), {
            transactions: [...this.state.transactions, newTransactionID]
        });
        this.setState({
            name: "",
            bill: {},
            payRecord: {},
            transactions: [...this.state.transactions, newTransactionID]
        });
    };

    redirectToGroupPage = () => {
        this.props.navigate("/group/" + this.props.groupID);
        window.location.reload(false);
    }

    render() {
        return (
            <div>
                <label>
                    {"Transaction Name: "}
                    <input
                      name = 'name'
                      onChange={this.handleChange}
                      placeholder="Enter transaction name"
                      value={this.state.name} />
                </label>
                <div>
                    <div>
                        <h2>Bill</h2>
                        <Record
                          groupMembers = {this.state.groupMembers || []}
                          getAmounts = {member => this.state.bill[member] || ""}
                          updateAmounts = {this.setBillAmounts} />
                    </div>
                    <div>
                        <h2>Pay Record</h2>
                        <Record
                          groupMembers = {this.state.groupMembers || []}
                          getAmounts = {member => this.state.payRecord[member] || ""}
                          updateAmounts = {this.setPayAmounts} />
                    </div>
                </div>
                <button onClick={this.submitTransaction}>Submit</button>
                <button onClick={this.redirectToGroupPage}>Return to Group Page</button>
            </div>
        );
    }
}

export default function NewTransaction(props) {
    let { groupID } = useParams();
    return <NewTransactionClass db = {props.db} navigate = {useNavigate()} groupID = {groupID} />
}
import React, { Component } from "react";

export default class RecordDisplay extends Component {
    render() {
        const transaction = this.props.transaction;
        const billItems = Object.entries(transaction.bill).map(([key, val], i) => {
            return (
                <div key={i}>
                    <div>{key}</div>
                    <div>{val}</div>
                </div>
            );
        });
        const payRecordItems = Object.entries(transaction.payRecord).map(([key, val], i) => {
            return (
                <div key={i}>
                    <div>{key}</div>
                    <div>{val}</div>
                </div>
            );
        });

        return (
            <div>
                <h2>{"Transaction Name: " + transaction.name}</h2>
                <div>
                    <div>
                        <h3>Bill</h3>
                        {billItems}
                    </div>
                    <div>
                        <h3>Pay Record</h3>
                        {payRecordItems}
                    </div>
                </div>
            </div>
        );
    }
}
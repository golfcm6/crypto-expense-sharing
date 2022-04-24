import React, { Component } from "react";

export default class Record extends Component {
    constructor(props){
        super(props);
        this.state = {getAmounts: this.props.getAmounts};
    }

    updateAmount = (member) => (event => this.props.updateAmounts(member, event.target.value));

    render() {
        const items = this.props.groupMembers.map((member, i) => (
            <div key={i}>
                <div>{member}</div>
                <input
                  name = {'amount ' + i}
                  onChange={this.updateAmount(member)}
                  value={this.state.getAmounts(member)} />
            </div>));
        return (
            <div>
                {items}
            </div>
        )
    }
}
import React, { Component } from "react";
import SplittingContract from "./contracts/Splitting.json";
import getWeb3 from "./getWeb3";

import "./App.css";

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      web3: null,
      senders: null,
      receivers: null,
      accounts: null,
      contract: null
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.recipientsSubmit = this.recipientsSubmit.bind(this);
    this.sendersSubmit = this.sendersSubmit.bind(this);
    // this.cancel = this.cancel.bind(this);
  }

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SplittingContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SplittingContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      alert(`Failed to load web3, accounts, or contract. Check console for details.`);
      console.error(error);
    }
  };

  async makeGroup(id, senders, sendVals, receivers, recVals) {
    await this.state.contract.methods.createGroup(id, senders, sendVals, receivers, recVals)
                                     .send({ from: this.state.accounts[0] });
  }

  async recipientsSubmit (event) {
    event.preventDefault();
    await this.state.contract.methods.recipients(event.target.groupid.value).send({ from: this.state.accounts[0] });
  }

  // handleSubmit (event) {
  //   this.makeGroup([20], [this.state.accounts[0], "0x98FBdf15Eb900aCbb367Af7121d6Ae7aCf3e8816"], [this.state.web3.utils.toWei("200000000", "gwei"), this.state.web3.utils.toWei("200000000", "gwei")], [this.state.accounts[0], this.state.accounts[0]], [this.state.web3.utils.toWei("200000000", "gwei"), this.state.web3.utils.toWei("200000000", "gwei")]);
  // };

  async sendersSubmit (event) {
    event.preventDefault();
    const payload = {
      from: this.state.accounts[0],
      value: this.state.web3.utils.toWei(event.target.payment.value, "gwei")
    };
    await this.state.contract.methods.senders(event.target.groupid.value).send(payload);
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div>
        <h1>Distro</h1>
        <nav
          style={{
            borderBottom: "solid 1px",
            paddingBottom: "1rem",
          }}
        >
          <Link to="/login">Log out</Link>
        </nav>
        <Outlet />
      </div>
    );
  }
}

      /*<div className="App">
        {/*<div>For senders</div>
        <form onSubmit={this.sendersSubmit}>
          <label>Group ID</label>
          <br />
          <input type="number" name="groupid"></input>
          <br />
          <label>Payment</label>
          <input type="number" name="payment"></input>
          <br />
          <button type="submit" id="submit-button">Submit</button>
        </form>
        <button onClick={this.sendersSubmit} value="sender"></button>
        <button onClick={this.recipientsSubmit} value="recipients"></button>
        <button onClick={this.handleSubmit} value="Create Group"></button>
        <br />
        <br />
        <div>For distributing funds to recipients</div>
        <form onSubmit={this.recipientsSubmit}>
          <label>Group ID</label>
          <br />
          <input type="number" name="groupid"></input>
          <button type="submit" id="submit-button">Submit</button>
        </form>
        <div>The stored value is: {this.state.accounts[0]}</div>
      </div>*/
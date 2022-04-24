import React, { Component } from "react";
import SplittingContract from "./contracts/Splitting.json";
import getWeb3 from "./getWeb3";
import Web3 from "web3";
import { Container } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';

import "./App.css";

class App extends Component {

  constructor() {
    super();
    this.state = {
      storageValue: 0,
      web3: null,
      senders: null,
      receivers: null,
      accounts: null,
      contract: null,
      increment: 10
    };
    this.makePayment = this.makePayment.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.recipientsSubmit = this.recipientsSubmit.bind(this);
    this.sendersSubmit = this.sendersSubmit.bind(this);
    this.readSell = this.readSell.bind(this);
    this.readEarn = this.readEarn.bind(this);
    // this.cancel = this.cancel.bind(this);
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      // console.log(accounts);

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SplittingContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SplittingContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      alert("Contract found!");
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };
  async readSell(event) {
    event.preventDefault();
    const output = await this.state.contract.methods.readSeller(event.target.groupid.value, event.target.address.value).call();
    // console.log(output);
  }

  async readEarn(event) {
    event.preventDefault();
    const output = await this.state.contract.methods.readEarner(20).call();
    // console.log(output);
  }

  async makePayment() {
    await this.state.contract.methods.sendTransaction({ from: this.state.accounts[0], value: 20 })
  }

  async makeGroup(id, senders, sendVals, receivers, recVals) {

    await this.state.contract.methods.createGroup(id, senders, sendVals, receivers, recVals).send({ from: this.state.accounts[0] });
    this.setState({ increment: (this.state.increment + 1) });
    // console.log(this.state.increment);
    // alert("group created");
    // console.log("groupmade");
  }

  async recipientsSubmit(event) {
    event.preventDefault();
    // console.log(event.target.groupid.value);
    await this.state.contract.methods.recipients(event.target.groupid.value).send({ from: this.state.accounts[0] });

    // await this.state.contract.methods.recipients(event.target.groupid.value).send({ from: this.state.accounts[0] });

  }
  handleSubmit(event) {
    // event.preventDefault();
    this.makeGroup([20], [this.state.accounts[0], "0x98FBdf15Eb900aCbb367Af7121d6Ae7aCf3e8816"], [this.state.web3.utils.toWei("200000000", "gwei"), this.state.web3.utils.toWei("200000000", "gwei")], [this.state.accounts[0], this.state.accounts[0]], [this.state.web3.utils.toWei("200000000", "gwei"), this.state.web3.utils.toWei("200000000", "gwei")]);
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    // Get the value from the contract to prove it worked.
    // Update state with the result.
    this.setState({ storageValue: 69 });
  };


  async sendersSubmit(event) {
    event.preventDefault();
    await this.state.contract.methods.senders(event.target.groupid.value).send({ from: this.state.accounts[0], value: this.state.web3.utils.toWei(event.target.payment.value, "gwei") });

  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <Container
          style={{
            backgroundColor: 'green'
          }}
        >
          <h1>Distro</h1>
        </Container>
        <Container
          style={{

          }}>
          <span class="square border border-black">
            <h3>Paving the way for mass-scale crypto payment adoption.</h3>
          </span>
        </Container>
        <button onClick={this.handleSubmit} value="Create Group">Create a Group!</button>
        <br />
        <div>For Senders:</div>
        <form onSubmit={this.sendersSubmit}>
          <label>Group ID</label>
          <br />
          <input type="number" name="groupid"></input>
          <br />
          <label>Payment Amount</label>
          <br />
          <input type="number" name="payment"></input>
          <br />
          <button type="submit" id="submit-button">Submit</button>
        </form>
        <br />
        {/* {/* <button onClick={this.sendersSubmit} value="sender"></button> */}
        {/* <button onClick={this.recipientsSubmit} value="recipients"></button> */}        <br />
        <br />
        <div>Check how much you owe here.</div>
        <form onSubmit={this.readSell}>
          <label>Group ID</label>
          <br />
          <input type="number" name="groupid"></input>
          <br />
          <label>Wallet Address</label>
          <br />
          <input type="text" name="address"></input>
          <br />
          <button type="submit" id="submit-button">Submit</button>
        </form>
        <br />
        <br />
        <div>Initialize once a group is really to distribute funds to recipients.</div>
        <form onSubmit={this.recipientsSubmit}>
          <label>Group ID</label>
          <br />
          <input type="number" name="groupid"></input>
          <br />
          <button type="submit" id="submit-button">Submit</button>
        </form>
        <br />
        <button onClick={this.readEarn}>Check how much people are owed!</button>
        <div>The stored wallet address is: {this.state.accounts[0]}</div>
      </div>

    );
  }
}

export default App;
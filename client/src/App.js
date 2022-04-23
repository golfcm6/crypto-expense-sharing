import React, { Component } from "react";
import SplittingContract from "./contracts/Splitting.json";
import getWeb3 from "./getWeb3";
import Web3 from "web3";

import "./App.css";

class App extends Component {
  
  constructor() {
    super();
    this.state = { storageValue: 0, web3: null, accounts: null, contract: null, increment: 10};
    this.makePayment = this.makePayment.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      console.log(accounts);

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

  async makePayment () {
    await this.state.contract.methods.sendTransaction({ from: this.state.accounts[0], value: 20 })
  }

  async makeGroup(id, senders, sendVals, receivers, recVals) {

    await this.state.contract.methods.createGroup(id, senders, sendVals, receivers, recVals).send({from: this.state.accounts[0] });
    this.setState({ increment: (this.state.increment + 1) });
    console.log(this.state.increment);
    alert("group created");
    console.log("groupmade");
  }

   handleSubmit  (event) { 
    event.preventDefault();
    this.makeGroup([20], [this.state.accounts[0]], [50], [this.state.accounts[0]], [25]);
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    // Get the value from the contract to prove it worked.
    // Update state with the result.
    this.setState({ storageValue: 69 });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 42</strong> of App.js.
        </p>
        <button onClick={this.handleSubmit}></button>
        <div>The stored value is: {this.state.accounts[0]}</div>
      </div>
    );
  }
}

export default App;

// SPDX-License-Identifier: MIT
pragma solidity =0.5.0;
// import "@nomiclabs/buidler/console.sol";

// Smart Contract for Distro - split crypto payments with friends

// Design Overview
// - Contract holds Groups (structs with addresses + final amounts due/owed)
// - Philosophy is that people "approve" the proposed fund distribution that
//   they were shown on frontend by sending funds (signing). This happens
//   through senders() function.
// - Ability for any 1 address to cancel whole distribution process; money is
//   locked in contract (not given to people owed funds) until all group members
//   have signed/sent funds).

contract Splitting {
  address payable public owner;
  
  struct Group {
    // arrays of addresses 
    address payable [] sendAd;
    address payable [] recAd;
    // map from sender's address to the amount they owe
    mapping(address => uint) sendMap;
    // map from the receiver's address to the amount they are due to receive
    mapping(address => uint) receiveMap;
    // map from address to bool saying if thi address is in the group or not
    mapping(address => bool) isInGroup;
    // refers to index of this group in groupExists map
    uint groupID;
    // original invoices, used for cancel fn transaction rollbacks
    uint [] originalAmounts;
  }

  // map telling you that given a groupID, whether or not a group with that id number exists
  mapping (uint => bool) groupExists;
  // map that given an id number, will give you the Group instance matching it
  mapping (uint => Group) getGroup;
  Group[] groups;

  // nothing needs to be done at contract initialization since Groups are added/removed as needed
  constructor() public {
    owner =  msg.sender;
  }
  
  // Function to create a group when given a final list of addresses and amounts, tagged as 
  // senders (who we need money from) and receivers (who needs money sent to them).
  function createGroup(uint group_id, address payable [] memory sendAdr, uint [] memory sendAmo, address payable [] memory recAdr, uint [] memory recAmo) public{
    // group_id must not currently be in use
    require(!groupExists[group_id], "group ID taken, choose different ID");
    groupExists[group_id] = true;
    
    // add the proposed group to our group mapping
    getGroup[group_id] = Group({
      sendAd: sendAdr,
      recAd: recAdr,
      groupID: group_id,
      originalAmounts: sendAmo
    });
    // set the mappings (isInGroup for all users, sender amounts, and receiver amounts)
    for (uint i = 0; i < sendAdr.length; i++){
        getGroup[group_id].isInGroup[sendAdr[i]] = true;
        getGroup[group_id].sendMap[sendAdr[i]] = sendAmo[i];
      }

    for (uint i = 0; i < recAdr.length; i++){
        getGroup[group_id].isInGroup[recAdr[i]] = true;
        getGroup[group_id].receiveMap[recAdr[i]] = recAmo[i];
      }
  }

  // // function for sending out metamask requests for payment/addresses to connect to contract
  //   // happens after someone clicks connect to wallet
  // function sendRequests(bool isSender, uint amount) public {
  //   if (isSender == true) {
  //     // metamask request for amount to msg.sender
  //   }
  //   else {
  //     // metamask request for 0 to msg.sender, they do this to approve the setup and aren't charged anything
  //   }
  // }

  // Function to update amounts owed by senders. Specific amount charged determined by frontend. Returns amount still due.
  function senders (uint group_id) public payable returns (uint) {
    // make sure the input group exists
    require(groupExists[group_id], "group ID does not exist");
    Group storage currGroup = getGroup[group_id];
    // make sure the sender is in the group
    require(currGroup.isInGroup[msg.sender], "sending address is not in this group");

    // update balance due based on payment amount
    uint newBalance = currGroup.sendMap[msg.sender] - msg.value;
      currGroup.sendMap[msg.sender] = newBalance;
      // will be 0 only if fully paid
      return(newBalance);
  }


  // Function to send funds to recipients and close the group. Called when frontend sees 
  // "green checks" from everyone (all senders have paid full amount).
  function recipients(uint group_id) public{
    // make sure the input group exists
    require(msg.sender == owner, "caller must be the owner");
    require(groupExists[group_id], "group ID does not exist");
    // iterate through all receive requests and send them needed amounts. Only happens post-senders
    // so we know that enough money is locked in the contract to send this. 
    for (uint i = 0; i < getGroup[group_id].recAd.length; i++) {
      uint amountOwed = getGroup[group_id].receiveMap[getGroup[group_id].recAd[i]];

      (getGroup[group_id].recAd[i]).transfer(amountOwed);

      getGroup[group_id].receiveMap[getGroup[group_id].recAd[i]] -= amountOwed;
    }
  

    // cleanup: group no longer exists (no mapping for it)
    groupExists[group_id] = false;
  }

  // function to revert all transactions, called by frontend when expiry date is hit OR someone has rejected terms
  // just need the original terms for sender amounts, since those may need to be reverted
  function cancel(uint group_id) public payable {
    // make sure the input group exists
    require(groupExists[group_id], "group ID does not exist");
    Group storage currGroup = getGroup[group_id];

    for (uint i = 0; i < currGroup.sendAd.length; i++) {
      uint diff = currGroup.originalAmounts[i] - currGroup.sendMap[currGroup.sendAd[i]];
      if (diff != 0) {
        // send money back if they paid anything so far. Contract guaranteed to have this locked since 
        // receive() not yet called.

        // (bool success, ) = currGroup.sendAd[i].call{value:diff}("");
        // require(success, "Transfer failed.");

        bool send = currGroup.sendAd[i].send(diff);
        require(send, "Money was not sent!");
      }
    }

    // cleanup: we remove the group fully (no longer in our mappings)
    groupExists[group_id] = false;
  }

  // for testing
  function readSeller(uint group_id, address user) public view returns (uint) {
    return getGroup[group_id].sendMap[user];     
  }

  function readEarner(uint group_id) public view returns (uint) {
    return getGroup[group_id].receiveMap[getGroup[group_id].recAd[1]];     
  }

  function getBalance () public view returns (uint) {
    return address(this).balance;
  }

//**TO DO**
// - Look into how recipients() works when contract hasn't received any money
// - For some reason BBB was totally good on this despite no receive() fn
// - Could just do the totalAmount counter for our own understanding, but local testing is required to fully see it failing
// - (point is we don't want to see the receiver() function do anything unless contract has enough money in)


//**ORDER OF EVENTS**
// - frontend calls createGroup()
// - preceive




  // order needs to be someone tries to pay us, receive function goes through, we then do senders function to update internally
  // then frontend tells us everyone has paid, so we call recipients() and are done







  // FIX THIS LATER BBB DIDN'T HAVE ANY OF THIS? FOR JUST RECEIVING MONEY
  // function () external payable {}

  // // reaction to receiving ETH, simple
  // event Received(address, uint);
  // receive() external payable {
  //     emit Received(msg.sender, msg.value);
  // }
}
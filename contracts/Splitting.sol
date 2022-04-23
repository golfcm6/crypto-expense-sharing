// SPDX-License-Identifier: MIT
pragma solidity =0.5.0;

// Smart Contract for Distro
contract Splitting {
  // high level: contract stores array of groups
  // each group is a list of tuples/mappings: address, amount owed/to be paid
  // contract is initialized with this list (can't get around resizing array), we remove groups as expiry hits
  address public owner;
  
  
  struct Group {
    // this assumes correct information fed in by the frontend!
    address payable [] sendAd;
    address payable [] recAd;
    //map from sender's address to the amount they owe
    mapping(address => uint) sendMap;
    //map from the receiver's address to the amount they are due to receive
    mapping(address => uint) receiveMap;
    //map from address to bool saying if thi address is in the group or not
    mapping(address => bool) isInGroup;
    // refers to index of this.group in groups array
    uint groupID;
  }

  //map telling you that given a uint for an id number, whether or not a group with that id number exists
  mapping (uint => bool) groupExists;
  //map that given an id number, will give you the Group instance matching it
  mapping (uint => Group) getGroup;
  Group[] groups;

  
  constructor() public {
    owner = msg.sender;
  }
  
function createGroup(uint groupID, address payable [] memory sendAdr, uint [] memory sendAmo, address payable [] memory recAdr, uint [] memory recAmo) public{
  // set this as a valid group ID
  assert(!groupExists[groupID]);
  groupExists[groupID] = true;
  
  // add the proposed group to our group mapping
  getGroup[groupID] = Group({
    sendAd: sendAdr,
    recAd: recAdr,
    groupID: groupID
    // initializing group amount mappings and making input addresses associated with this group
  });



  for (uint i = 0; i < sendAdr.length; i++){
      getGroup[groupID].isInGroup[sendAdr[i]] = true;
      getGroup[groupID].sendMap[sendAdr[i]] = sendAmo[i];
    }

  for (uint i = 0; i < recAdr.length; i++){
      getGroup[groupID].isInGroup[recAdr[i]] = true;
      getGroup[groupID].receiveMap[recAdr[i]] = recAmo[i];
    }

}

  // function for sending out metamask requests for payment/addresses to connect to contract
    // happens after someone clicks connect to wallet
  function sendRequests(bool isSender, uint amount) public {
    if (isSender == true) {
      // metamask request for amount to msg.sender
    }
    else {
      // metamask request for 0 to msg.sender, they do this to approve the setup and aren't charged anything
    }
  }

// function to update amounts owed by senders. Returns 0 if paid in full or too much since don't owe any more
// (if too much, calls function to return extra money to user), otherwise returns the amount they still have to pay
function senders (uint group_id) public payable returns (uint) {
  // make sure the specific group exists
  assert(groupExists[group_id] == true);
  Group storage currGroup = getGroup[group_id];
  // make sure this address exists in the group
  assert(currGroup.isInGroup[msg.sender] == true);

  uint newBalance = currGroup.sendMap[msg.sender] - msg.value;
  // cases are someone still owing money, having paid exactly what they owed, and paying too much
    currGroup.sendMap[msg.sender] = newBalance;
    return(newBalance);

}


// function makePayments (address sender, address receiver, uint amount){
  // called when frontend sees "green checks" from everyone, we know everyone has paid and we're good to go with receivers
  function recipients(uint group_id) public {
      assert(groupExists[group_id] == true);
    Group storage currGroup = getGroup[group_id];

    // iterate through all receive requests and do .transfer to send them money
    for (uint i = 0; i < currGroup.recAd.length; i++) {
      uint amountOwed = currGroup.receiveMap[currGroup.recAd[i]];
      currGroup.receiveMap[currGroup.recAd[i]] = 0;
      msg.sender.transfer(amountOwed);
    }

    // also handles cleanup, we say the group doesn't exist so this id can be used in the future
    groupExists[group_id] = false;
  }

  function readSeller (uint group_id) public view returns (uint){
    return getGroup[group_id].sendMap[getGroup[group_id].sendAd[0]]; 
        
        // console.log(groups[i].recAd);
        // groups[i].sendMap("0xda4c8439A9680dF645c72422a00E109e5b78Bd6C");
    
  }
  function readEarner (uint group_id) public view returns (uint){
    return getGroup[group_id].receiveMap[getGroup[group_id].recAd[0]]; 
        
        // console.log(groups[i].recAd);
        // groups[i].sendMap("0xda4c8439A9680dF645c72422a00E109e5b78Bd6C");
    
  }


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
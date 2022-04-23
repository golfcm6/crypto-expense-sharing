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
    mapping(address => uint) sendMap;
    mapping(address => uint) receiveMap;
    mapping(address => bool) isInGroup;
  }

  mapping (uint => bool) groupIDs;
  Group[] groups;

  
  // dynamic arrays of Group structs, so contract initialization is simple!
  constructor() public {
    owner = payable(msg.sender);
  }
  
// when a 
function createGroup(uint groupID, address[] sendAdr, uint[]sendAmo, address[]recAdr, uint[]recAmo) {
  // set this as a valid group ID
  groupIDs[groupID] = true;
  // add the proposed group to our dynamic array of groups
  groups.push(Group({
    sendAd: sendAdr;
    recAd: recAdr;
    // initializing group amount mappings and making input addresses associated with this group
    for (int i = 0; i < sendAd.length; i++){
      isInGroup[sendAd[i]] = true;
      isInGroup[recAd[i]] = true;
      sendMap[sendAd[i]] = sendAmo[i];
      receiveMap[recAd[i]] = recAmo[i];
    }
  }));
}

// function to update amounts owed by senders. Returns 0 if paid in full or too much since don't owe any more
// (if too much, calls function to return extra money to user), otherwise returns the amount they still have to pay
function senders (uint group_id, uint amount_paid) public view returns (uint) {
  // make sure the specific group exists
  assert(groupIDs[msg.sender] == true);
  Group currGroup = groups[group_id]
  // make sure this address exists in the group
  assert(currGroup.isInGroup(msg.sender) == true);

  // find the person amount paid in sender array
  uint sender_id = 0;
  // this will never be infinite because we checked the existence mapping
  while (currGroup.sendAd[sender_id] != msg.sender) {
    sender_id++;
  }
  uint newBalance = currGroup.sendAm[sender_id] - amount_paid;
  // cases are someone still owing money, having paid exactly what they owed, and paying too much
  if (newBalance >= 0) {
    currGroup.sendAm[sender_id] = newBalance;
    return(newBalance);
  }
  else {
    // balance is negative, we pay them that times -1
    currGroup.sendAm[sender_id] = 0;
    msg.sender.transfer(-newBalance);
    return(0);
  }
     
   
}

function makePayments (address sender, address receiver, uint amount){
}

function recipients(uint ) {

}


}

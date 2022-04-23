pragma solidity >=0.4.21 <0.7.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Splitting.sol";

contract TestSimpleStorage {

  function testItStoresAValue() public {
    Splitting splitting = Splitting(DeployedAddresses.Splitting());

    splitting.set(89);

    uint expected = 89;

    Assert.equal(splitting.get(), expected, "It should store the value 89.");
  }

}

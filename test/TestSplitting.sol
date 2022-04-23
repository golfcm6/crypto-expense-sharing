pragma solidity >=0.4.21 <0.7.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Splitting.sol";

contract TestSplitting {

  function testSplit() public {
    Splitting splitting = Splitting(DeployedAddresses.Splitting());
    address payable [3]  memory sellers = [0x8dd8dB4DBf48983E5b1B586A8Bb13126aB8A7516, 0xD0ECD36957d97c30ba5438c06f3225aCF76738F6, 0x0C49426c28506342F5B5A713FA9a0074f70Be8e5];
    address payable [2]  memory earners = [0x7dc2A43c94BC5045c5Ed035E38F0AE49D7e380B6, 0x7be0497665a111D8EfB315F8A5C371e0EdB59563];

    splitting.createGroup(20, [0x8dd8dB4DBf48983E5b1B586A8Bb13126aB8A7516, 0xD0ECD36957d97c30ba5438c06f3225aCF76738F6, 0x0C49426c28506342F5B5A713FA9a0074f70Be8e5], [20, 10, 5], [0x7dc2A43c94BC5045c5Ed035E38F0AE49D7e380B6, 0x7be0497665a111D8EfB315F8A5C371e0EdB59563], [50, 100]);
    

    uint expected = 10;

    Assert.equal(splitting.readGroup(20), expected, "It should store the value 10.");
  }

}

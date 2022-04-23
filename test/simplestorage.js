const Splitting = artifacts.require("./Splitting.sol");

contract("Splitting", accounts => {
  it("...should store the value 89.", async () => {
    const splittingInstance = await Splitting.deployed();

    // Set value of 89
    await splittingInstance.set(89, { from: accounts[0] });

    // Get stored value
    const storedData = await splittingInstance.get.call();

    assert.equal(storedData, 89, "The value 89 was not stored.");
  });
});

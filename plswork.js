const Splitting = artifacts.require('Splitting');

module.exports = async function(callback) {
    let splitting = await Splitting.deployed();
    let groupid = 20;
    await splitting.recipients(groupid);
    callback();
}
const Splitting = artifacts.require('Splitting')

module.exports = async function(callback) {
    let splitting = await Splitting.deployed();
    await splitting.createGroup(42, ["0xDcEd3b4F629E0Af308213f8CB12bec196D5E0C55"], [50000], ["0xda4c8439A9680dF645c72422a00E109e5b78Bd6C"],  [50000]);

    let groupIDs = await splitting.AllGroups();
    console.log(groupIDs);

    await splitting.recipients(40).send({ from: "0xDcEd3b4F629E0Af308213f8CB12bec196D5E0C55" });

    for (let i = 1; i < groupIDs.length; i++) {
        console.log(i)
        console.log(groupIDs[i])
        await splitting.recipients(groupIDs[i]);
        console.log("check")
    }
    callback();
}
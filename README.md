# Distro
Split crypto payments with your friends!

## Inspiration
Over the past few days, our team has grown increasingly annoyed with how hard it is to manage transactions during this trip: keeping track of who pays for meals, transport, etc., and more importantly if someone has been paid back or not, is quite the struggle. We saw this as a perfect application to build out during ETH Amsterdam. Distro streamlines the collection of transaction data in a clear frontend/UX, coupled with a Solidity backend for instant payouts.

## Design/Tech
Truffle, Solidity, React + Firebase, web3.js.

We used Truffle because of the ease with which we could test everything locally; specific smart contract functions, broader interactions with React components, etc. We also, of course, chose to build an EVM compatible app because of ETH's widespread popularity and the straightforward changes we'd make to port to EVM compatible platforms, such as Polygon and Optimism. Our focus on the backend was on designing efficient and intuitive functions: the logic boils down to storing Groups as structs (that use mappings to amounts owed) and functions to create a group, send debts, distribute locked funds, and cancel. 

## ETH Amsterdam Hackathon Submission
Polygon Finity Link: https://www.figma.com/file/nGKzSaEpLjAVfZwrgIWbD4/Finity-Design-System-%F0%9F%92%9C-(Community)?node-id=35430%3A26414

Note that the code on this repo is currently setup for deployment on Ganache locally and Ethereum testnets. We are also compatible with Polygon and Optimism (for Polygon, we simply followed [this](https://dapp-world.com/smartbook/deploy-smart-contract-on-polygon-pos-using-truffle-UnEo) and used 

## Takeaways
One memorable aspect of the technical design process was spending a long time debugging, only for us to realize that the code was completely correct (test cases were inaccurate compared to our expectations). We seriously had correct code, but spent over 5 hours "debugging" on this; the issue ended up being that we were entering microscopic amounts of money for "amounts owed" by users because the unit was Wei instead of Ether, so it appeared as if contract funds and address funds were not changing when they were (just a super small amount). We will certainly remember the time we spent on this, and have learned a valuable lesson about "testing the test cases", not just the functions we run them on!

Built with love by Charles Ma, Christy Jestin, Ash Ahmed, and Nyle Garg.

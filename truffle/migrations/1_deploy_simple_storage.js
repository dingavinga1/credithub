const Bank = artifacts.require("../contracts/Bank.sol");

module.exports = function (deployer) {
  deployer.deploy(Bank, {value: 60000000000000000000});
};

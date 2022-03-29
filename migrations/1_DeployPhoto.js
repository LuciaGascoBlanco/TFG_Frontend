const Photo = artifacts.require("Photo");

module.exports = function (deployer) {
  deployer.deploy(Photo);
};
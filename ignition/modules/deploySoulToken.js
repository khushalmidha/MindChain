const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("SoulTokenDeployment", (m) => {
  // The deployer will automatically be the first signer
  const deployer = m.getAccount(0);

  // Define the contract to deploy with the deployer as the initialOwner
  const soulToken = m.contract("SoulToken", [deployer]);

  
  // Return the deployed contract instance
  return { soulToken };
});

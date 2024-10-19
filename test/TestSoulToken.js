const { expect } = require("chai");

describe("SoulToken", function () {
  let soulToken;
  let owner, addr1;

  beforeEach(async function () {
    const SoulToken = await ethers.getContractFactory("SoulToken");
    [owner, addr1] = await ethers.getSigners();
    soulToken = await SoulToken.deploy(owner.address);
    // await soulToken.deployed();
  });

  it("should mint initial supply to the owner", async function () {
    const ownerBalance = await soulToken.balanceOf(owner.address);
    expect(ownerBalance).to.equal(1000 * 10);
  });

  it("should allow owner to earn tokens for a user", async function () {
    await soulToken.earnTokens(addr1.address);
    const balance = await soulToken.balanceOf(addr1.address);
    expect(balance).to.equal(10);
  });

  it("should allow owner to reduce tokens", async function () {
    await soulToken.earnTokens(addr1.address);
    await soulToken.reduceTokens(addr1.address);
    const balance = await soulToken.balanceOf(addr1.address);
    expect(balance).to.equal(1);  // 10 / 10 = 1
  });
});

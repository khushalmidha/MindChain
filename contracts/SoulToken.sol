// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SoulToken is ERC20, Ownable {
    event TokensEarned(address indexed user, uint256 amount);
    event TokensUpdated(address indexed user, uint256 amount);

    constructor(
        address initialOwner
    ) ERC20("SoulToken", "SOUL") Ownable(initialOwner) {
        // Mint initial supply for the owner (deployer or specified owner)
        _mint(initialOwner, 1000 * 10);
    }

    function earnTokens() public {
        // Token earning logic

        _mint(msg.sender, 10);
        emit TokensEarned(msg.sender, 10);
        uint256 total = checkNoOfTokens(msg.sender) + 10;
        emit TokensUpdated(msg.sender, total);
    }

    function checkNoOfTokens(address user) public view returns (uint256) {
        return balanceOf(user);
    }

    function reduceTokens() external {
        // Token reduction logic
        uint256 currentBalance = balanceOf(msg.sender);
        require(currentBalance > 0, "Balance already zero");

        uint256 reducedBalance = currentBalance / 10;
        _burn(msg.sender, reducedBalance);
        uint256 total;
        if (currentBalance - reducedBalance >= 0) {
            total = currentBalance - reducedBalance;
        } else {
            total = 0;
        }
        emit TokensUpdated(msg.sender, total);
    }
}

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

    function reduceTokens(uint256 amount) external {
        // Get the current balance of the user
        uint256 currentBalance = balanceOf(msg.sender);

        // Check if the balance is less than the amount to reduce
        require(currentBalance >= amount, "Insufficient balance");

        // Burn the specified amount of tokens from the user's balance
        _burn(msg.sender, amount);

        // Emit the updated balance after burning tokens
        uint256 total = currentBalance - amount;
        emit TokensUpdated(msg.sender, total);
    }
}

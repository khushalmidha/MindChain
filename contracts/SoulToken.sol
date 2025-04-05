// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SoulToken is ERC20, Ownable {
    event TokensEarned(address indexed user, uint256 amount);
    event TokensUpdated(address indexed user, uint256 amount);

    IERC20 public pyusd;

    constructor(
        address initialOwner,
        address pyusdAddress
    ) ERC20("SoulToken", "SOUL") Ownable(initialOwner) {
        pyusd = IERC20(pyusdAddress);
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

    
    function reduceTokens(uint256 token, uint256 totalAmount, address receiver) external {
    uint256 currentBalance = balanceOf(msg.sender);
    require(currentBalance >= token, "Insufficient token balance");
    
    // Pull the full amount once from the user
    require(pyusd.transferFrom(msg.sender, address(this), totalAmount), "Transfer failed");

    uint256 ownerShare = (totalAmount * 20) / 100; // 20%
    uint256 receiverShare = totalAmount - ownerShare; // 80%

    require(pyusd.transfer(owner(), ownerShare), "Owner transfer failed");
    require(pyusd.transfer(receiver, receiverShare), "Receiver transfer failed");

    _burn(msg.sender, token);

    emit TokensUpdated(msg.sender, currentBalance - token);
}

}

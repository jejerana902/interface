// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title USDC - Testnet USD Coin for Nexus Testnet3
/// @notice Deploy this contract on Nexus Testnet3 and update the address in:
///   - packages/uniswap/src/features/chains/evm/info/nexus.ts (tokens.USDC, tokens.stablecoins)
///   - apps/web/src/constants/tokens.ts
///   - apps/web/src/constants/routing.ts
contract USDC {
    string public name = "USD Coin";
    string public symbol = "USDC";
    uint8 public decimals = 6;
    address public owner;
    uint256 public totalSupply;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /// @notice Mint USDC tokens (only owner). Use for testnet faucet.
    /// @param to Address to mint to
    /// @param amount Amount to mint (in 6 decimal units, e.g. 1000000 = 1 USDC)
    function mint(address to, uint256 amount) external onlyOwner {
        totalSupply += amount;
        balanceOf[to] += amount;
        emit Transfer(address(0), to, amount);
    }

    /// @notice Public faucet - anyone can mint up to 10,000 USDC at a time for testing
    function faucet() external {
        uint256 amount = 10_000 * 10**decimals; // 10,000 USDC
        totalSupply += amount;
        balanceOf[msg.sender] += amount;
        emit Transfer(address(0), msg.sender, amount);
    }

    function transfer(address to, uint256 amount) public returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount) public returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) public returns (bool) {
        require(balanceOf[from] >= amount, "Insufficient balance");
        if (from != msg.sender && allowance[from][msg.sender] != type(uint256).max) {
            require(allowance[from][msg.sender] >= amount, "Insufficient allowance");
            allowance[from][msg.sender] -= amount;
        }
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        emit Transfer(from, to, amount);
        return true;
    }
}

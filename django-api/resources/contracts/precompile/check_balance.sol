pragma solidity >=0.7.0 <0.9.0;
import "./HederaTokenService.sol";
import "./HederaResponseCodes.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

contract ContractExample is HederaTokenService {
    uint256 private token_balance;
    address private account_id;
    address private token_id;

    function checkBal(address token_address, address holder_address) public view returns(uint) {
        IERC20 token = IERC20(token_address);
        return token.balanceOf(holder_address);
    }

    // @dev contract functions can't process and return on the same request
    // instead we store the values temporarily for another request 
    function initTokenBalance(address token, address account) public {
        account_id = account;
        token_id = token;
        token_balance = IERC20(token).balanceOf(account);
    }

    // @dev must be set with initTokenBalance first
    function getTokenBalance() public view
    returns (uint256 balance) {
        return token_balance;
    }

    // @dev must be set with initTokenBalance first
    function getAccountId() public view
    returns (address id) {
        return account_id;
    }

    // @dev must be set with initTokenBalance first
    function getTokenId() public view
    returns (address id) {
        return token_id;
    }
}
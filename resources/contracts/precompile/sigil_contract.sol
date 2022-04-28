pragma solidity >=0.7.0 <0.9.0;
import "./HederaTokenService.sol";

contract SigilContract is HederaTokenService {
    string private FILE_HASH;
    address private contract_owner;
    address[] private access_list;

    function getFileHash() public view returns(string memory){
        return FILE_HASH;
    }
    
    function setFileHash(string memory file_hash) public {
        FILE_HASH = file_hash;
    }

    function getOwner() public view returns(address){
        return contract_owner;
    }

    function setOwner(address owner_address) public {
        contract_owner = owner_address;
    }

    function getAccessList() public view returns(address[] memory){
        return access_list;
    }

    function addAccess(address new_address) public {
        access_list.push(new_address);
    }
    
    function revokeAccess(address existing_address) public {
        address[] memory temp_address_list;
        uint i = 0;
        // Ensure access_list isn't empty
        while (access_list.length > 0) {
            // If last element of access_list matches search, delete & break
            if (access_list[access_list.length - 1] == existing_address){
                access_list.pop();
                break;
            }
            // Add last element in access_list to temporary list
            temp_address_list[i] = access_list[access_list.length - 1];
            // Delete last element in access_list
            access_list.pop();
            i = i + 1;
        }
        // If access_list is empty, set equal to temporary list  (performance saving)
        if (access_list.length == 0){
            access_list = temp_address_list;
        }
        // If temporary list is not empty, add elements to access_list
        if (temp_address_list.length > 0){
            for (i = 0; i < (temp_address_list.length - 1); i++){
                access_list.push(temp_address_list[i]);
            }
        } 
    }
}
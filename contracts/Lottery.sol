// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.17;

contract Lottery{
    address public manager;
    address[] public players;

    constructor(){
        manager = msg.sender;
    }


    modifier resticted(){
        require(msg.sender == manager);
        _;
    }

    function balance() public view returns (uint256){
        return payable(address(this)).balance;
    }
    
    function random() public view returns(uint){
        return uint(keccak256(abi.encodePacked(block.difficulty,block.timestamp,players)));
    }

    function enter() public payable{

        require(msg.value > .0001 ether);
        players.push(msg.sender);

        // if(players.length == 10){
        // uint index = random() % players.length;
        // payable(players[index]).transfer(balance());
        // players = new address[](0);
        // }
    }



    function pickWinner() public resticted {
        uint index = random() % players.length;
        payable(players[index]).transfer(balance());
        players = new address[](0);
    }

    function getPlayers() public view returns(address[] memory){
        return players;
    }
    
}
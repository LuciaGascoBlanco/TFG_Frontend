//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "./ERC721.sol";

contract Photo is ERC721 {

    string[] public photos;
    mapping(string => bool) _photoExists;

    struct Listing {
      uint256 price;
      address seller;
    }
    mapping(uint256 => Listing) public listings;
    mapping(address => uint256) public balances;

    constructor() ERC721("Photo", "PHOTO") {}

    function mint(uint256 price, string memory _photo) public {
      require(!_photoExists[_photo], "el hash ya esta en el array");
      photos.push(_photo);
      uint tokenID = photos.length -1;                        
      _safeMint(msg.sender, tokenID);    
      require(ownerOf(tokenID) == msg.sender, "caller must own given token");  //se debería cumplir siempre, quitable tras pruebas
      listings[tokenID] = Listing(price, msg.sender); 
      _photoExists[_photo] = true;
    }

    function indexOf(string[] memory arr, string memory searchFor) public pure returns (uint256, bool) {
      for (uint256 i = 0; i < arr.length; i++) {
        if ((keccak256(abi.encodePacked(arr[i])) == keccak256(abi.encodePacked(searchFor)))) {
          return (i, true);
        }
      }
      return (0, false);
    }

    function purchase(string memory _photo) public payable {  
      (uint256 a, bool b) = indexOf(photos, _photo);
      require(b, "b da falso y falla");
      uint256 tokenID = a;

      Listing memory item = listings[tokenID];
      require(ownerOf(tokenID) != msg.sender, "you can't buy it if you own it");  
      require(msg.value == item.price, "funds sent wrong");    
      balances[item.seller] += msg.value;                   

      safeTransferFrom(item.seller, msg.sender, tokenID);
      listings[tokenID] = Listing(item.price, msg.sender);

      address payable Seller = payable(item.seller);
      require(Seller.send(msg.value));
    }
}
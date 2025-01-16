// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Burnable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract Words is ERC721, ERC721Enumerable, ERC721URIStorage, ERC721Burnable {
    using Strings for uint256;
    
    /// @notice the total amount of words (free and golden)
    uint256 public totalWords;
    /// @notice the total amount of golden words (only golden)
    uint256 public totalGoldenWords;
    /// @notice mapping to track all the words by wordId
    /// @dev wordId can be computed from the plain text word uint256(keccak256(abi.encodePacked(word)))
    mapping(uint256 wordId => string word) public words;
    /// @notice mapping to track all the golden words by wordId
    mapping(uint256 wordId => string goldenWord) public goldenWords;
    /// @notice the last word added (including golden)
    string public theWord; 
    /// @notice the last golden word added (only golden)
    string public theGoldenWord; 
    /// @notice a small tipping amount sent when calling the goldenWord function
    uint256 public goldenPrice = 0.000069420 ether;
    /// @notice address of the deployer and recipient of the tips
    address payable deployer;
    
    /// @notice Event emitted after successfully added a new word. Free and golden.
    event NewWord(uint256 indexed wordId, string word, address indexed sender, bool indexed isGolden);

    constructor() ERC721("Words", "WORDS") {
        // set the recipient of the tips
        deployer = payable(msg.sender);
        // mint the first word to the deployer
        freeWord("word");
    }

    /// @notice anyone could call this function to add a new valid word into the contract
    function freeWord(string memory word) public returns (uint256 wordId) {
        uint256 wordLength = bytes(word).length;
        require(wordLength > 0 && wordLength <= 32, "Word length must 1-32");
        
        wordId = uint256(keccak256(abi.encodePacked(word)));
        require(bytes(words[wordId]).length == 0, "Word already exist");

        totalWords++;
        words[wordId] = word;
        theWord = word;

        _safeMint(msg.sender, wordId);
        _setTokenURI(wordId, _generateMetadata(wordId, false));
        
        emit NewWord(wordId, word, msg.sender, false);
    }

    /// @notice anyone could call this function to add a new valid golden word into the contract 
    /// and tipping the deployer with 0.000069420 ether.  
    function goldenWord(string memory word) public payable returns (uint256 wordId) {
        require(msg.value == goldenPrice, "Must pay the price");
        
        uint256 wordLength = bytes(word).length;
        require(wordLength > 0 && wordLength <= 64, "Word length must 1-64");
        
        wordId = uint256(keccak256(abi.encodePacked(word)));
        require(bytes(words[wordId]).length == 0, "Word already exist");

        totalWords++;
        totalGoldenWords++;
        words[wordId] = word;
        goldenWords[wordId] = word;
        theWord = word;
        theGoldenWord = word;
        
        _safeMint(msg.sender, wordId);
        _setTokenURI(wordId, _generateMetadata(wordId, true));
        
        emit NewWord(wordId, word, msg.sender, true);
    }
    
    /// @notice Check if a word already exists or not (include golden).
    function isWord(uint256 wordId) public view returns (bool) {
        return bytes(words[wordId]).length != 0;
    }
    
    /// @notice Check if a golden word already exists or not. (only golden)
    function isGoldenWord(uint256 wordId) public view returns (bool) {
        return bytes(goldenWords[wordId]).length != 0;
    }

    function _generateSVG(uint256 tokenId, bool isGolden) internal view returns (string memory) {
        string memory word = words[tokenId];
        string memory bgColor = isGolden ? "black" : "#3d3d3d";
        string memory textColor = isGolden ? "#DAA520" : "white";
        
        return string(abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 400 200">',
            '<rect width="400" height="200" fill="', bgColor, '"/>',
            '<text x="50%" y="50%" font-size="24px" font-family="serif" fill="', textColor, '" dominant-baseline="middle" text-anchor="middle">', word, '</text>',
            '</svg>'
        ));
    }

    function _generateMetadata(uint256 tokenId, bool isGolden) internal view returns (string memory) {        
        string memory svg = _generateSVG(tokenId, isGolden);
        string memory imageURI = string(abi.encodePacked(
            "data:image/svg+xml;base64,",
            Base64.encode(bytes(svg))
        ));

        return string(abi.encodePacked(
            "data:application/json;base64,",
            Base64.encode(bytes(abi.encodePacked(
                '{',
                '"name": "Words #', tokenId.toString(), '",',
                '"description": "You are your own words... choose them wisely... or not...",',
                '"image": "', imageURI, '",',
                '"attributes": [{"trait_type": "Word", "value": "', words[tokenId], '"},{"trait_type": "isGolden", "value": "', isGolden, '"}]',
                '}'
            )))
        ));
    }
    
    /// @notice this function send the tips to the recipient and can receive a custom tip
    function tipDeployer() external payable {
        (bool success, ) = deployer.call{ value: address(this).balance }("");
        if (!success) revert();
    }
    
    // the following functions are overrides required by Solidity.

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }
}

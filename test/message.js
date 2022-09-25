require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const { abi, evm } = require("../compile");
const secret = process.env.METAMASK_PHENOMENON;

const provider = new HDWalletProvider(
  secret,
  "https://goerli.infura.io/v3/6188e41b231048e4a6e0a5810dffb5ce"
);

let contractAddress;
let getMessage;
let messageContent;

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  // console.log("Attempting to deploy from account ", accounts[0]);

  contractAddress = "0x10b94236603bbcaa21a6db1a4a955104c41338d0";
  getMessage = await new web3.eth.Contract(abi, contractAddress).methods
    .message()
    .call()
    .then((data) => {
      messageContent = data;
    });
  console.log(messageContent);
};

deploy();

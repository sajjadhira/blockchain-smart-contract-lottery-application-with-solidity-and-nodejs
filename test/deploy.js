require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const { abi, evm } = require("../compile");
const secret = process.env.METAMASK_PHENOMENON;
console.log(secret);

const provider = new HDWalletProvider(
  secret,
  "https://goerli.infura.io/v3/6188e41b231048e4a6e0a5810dffb5ce"
);

let result;
let contractAddress;

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account ", accounts[0]);

  result = await new web3.eth.Contract(abi)
    .deploy({ data: evm.bytecode.object, arguments: ["Hi etherum!"] })
    .send({ gas: "1000000", from: accounts[0] });
  contractAddress = result.options.address;
  // console.log(result.options.address);

  console.log(`contact deployed to ${contractAddress}`);
};

deploy();

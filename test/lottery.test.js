// importing necessary files and libraries
const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

// get contract compiled information
const { abi, evm } = require("../compile");

// declare necessary variables
let lottery;
let accounts;
let players;

// const test = async () => {
//   accounts = await web3.eth.getAccounts();
//   console.log(accounts);
// };
// test();

// do before each for mocha test
beforeEach(async () => {
  // get accounts of current provider
  accounts = await web3.eth.getAccounts();

  // deploy and send contract information to the nodes
  lottery = await new web3.eth.Contract(abi)
    .deploy({
      data: evm.bytecode.object,
    })
    .send({
      from: accounts[0],
      gas: "1000000",
    });
});

// describing for mocha
describe("Lottery Function", () => {
  // check if deployed correctly
  it("Deployed Successfully", () => {
    // if lottery deployed

    assert.ok(lottery.options.address);
  });

  // allow one

  it("Allow one account", async () => {
    await lottery.methods
      .enter()
      .send({ from: accounts[0], value: web3.utils.toWei("0.02", "ether") });

    // get entered players

    players = await lottery.methods.getPlayers().call({
      from: accounts[0],
    });

    // asseting
    assert.equal(accounts[0], players[0]);

    assert.equal(1, players.length);
  });

  // allow multiple

  it("Allow multiple accounts to enter", async () => {
    // account 1
    await lottery.methods
      .enter()
      .send({ from: accounts[0], value: web3.utils.toWei("0.02", "ether") });

    // account 2

    await lottery.methods
      .enter()
      .send({ from: accounts[1], value: web3.utils.toWei("0.02", "ether") });

    // account 2
    await lottery.methods
      .enter()
      .send({ from: accounts[2], value: web3.utils.toWei("0.02", "ether") });

    // get entered players

    players = await lottery.methods.getPlayers().call({
      from: accounts[0],
    });

    // asseting
    assert.equal(accounts[0], players[0]);
    assert.equal(accounts[1], players[1]);
    assert.equal(accounts[2], players[2]);

    assert.equal(3, players.length);
  });

  // validating minimum

  it("Minimum amount", async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: 2000,
      });
      assert(false);
    } catch (err) {
      // throw error
      assert.ok(err);
    }
  });

  it("Keep winner without manager", async () => {
    try {
      await lottery.methods.pickWinner().send({
        from: accounts[1],
        value: 2000,
      });
      assert(false);
    } catch (err) {
      // throw error
      assert.ok(err);
    }
  });

  // sending money to the winner

  it("send money to the winner and set players empty", async () => {
    // entering into the lottery
    await lottery.methods
      .enter()
      .send({ from: accounts[0], value: web3.utils.toWei("2", "ether") });

    // get initial balance of the account
    const initialBalance = await web3.eth.getBalance(accounts[0]);

    // picking up the winner
    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    // get final balance of the account
    const finalBalance = await web3.eth.getBalance(accounts[0]);

    // calculate difference
    const difference = finalBalance - initialBalance;

    // asserting the result
    assert(difference > web3.utils.toWei("1.8", "ether"));
  });
});

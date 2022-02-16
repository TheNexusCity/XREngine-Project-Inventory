import dns from "dns";
import Web3 from "web3";
import { hdkey } from "ethereumjs-wallet";
import bip39 from "bip39";
import { Transaction } from "@ethereumjs/tx";

import abis from "../../config/abi.js";

const network = process.env.PRODUCTION ? "polygon" : "testnetpolygon";

import sequelize from "../../db";

import { INFURA_PROJECT_ID, POLYGON_VIGIL_KEY } from "./environment.js";

let web3,
  web3sockets,
  contracts,
  web3socketProviderUrls;

const loadPromise = (async() => {
  
  const asyncAddress = async() => {
    let data;
    try {
      data = await sequelize.query('SELECT identityValue,currencyValue,inventoryValue,currencyProxyValue,inventoryProxyValue,tradeValue FROM `ADDRESS_DATA` WHERE networkType=?', {type: sequelize.QueryTypes.SELECT,replacements: [network]});
    } catch (err) {
      console.log(err);
    }
    return data;
  };
  const addressData = await asyncAddress();
  
  let IDENTITY_ADDRESS = "";
  let CURRENCY_ADDRESS = "";
  let CURRENCYPROXY_ADDRESS = "";
  let INVENTORY_ADDRESS = "";
  let INVENTORYPROXY_ADDRESS = "";
  let TRADE_ADDRESS = "";
  if (typeof addressData[0] !== 'undefined')
  {
    IDENTITY_ADDRESS = addressData[0]['identityValue'];
    CURRENCY_ADDRESS = addressData[0]['currencyValue'];
    CURRENCYPROXY_ADDRESS = addressData[0]['currencyProxyValue'];
    INVENTORY_ADDRESS = addressData[0]['inventoryValue'];
    INVENTORYPROXY_ADDRESS = addressData[0]['inventoryProxyValue'];
    TRADE_ADDRESS = addressData[0]['tradeValue'];
  }

  web3 = {
    mainnet: new Web3(
      new Web3.providers.HttpProvider(
        `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`
      )
    ),

    testnet: new Web3(new Web3.providers.HttpProvider(
      `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`
    )),

    polygon: new Web3(
      new Web3.providers.HttpProvider(
        `https://rpc-mainnet.maticvigil.com/v1/${POLYGON_VIGIL_KEY}`
      )
    ),
    testnetpolygon: new Web3(new Web3.providers.HttpProvider(
      `https://rpc-mumbai.maticvigil.com/v1/${POLYGON_VIGIL_KEY}`
    ))
  };
  contracts = {};
  contracts[network] = {
    Identity: new web3[network].eth.Contract(
      abis.Identity,
      IDENTITY_ADDRESS
    ),
    Currency: new web3[network].eth.Contract(
      abis.Currency, 
      CURRENCY_ADDRESS
    ),
    CurrencyProxy: new web3[network].eth.Contract(
      abis.CurrencyProxy,
      CURRENCYPROXY_ADDRESS
    ),
    Inventory: new web3[network].eth.Contract(
      abis.Inventory, 
      INVENTORY_ADDRESS
    ),
    InventoryProxy: new web3[network].eth.Contract(
      abis.InventoryProxy,
      INVENTORYPROXY_ADDRESS
    ),
    Trade: new web3[network].eth.Contract(
      abis.Trade,
      TRADE_ADDRESS
    ),
  };
})();

async function getPastEvents({
  chainName,
  contractName,
  eventName = "allEvents",
  fromBlock = 0,
  toBlock = "latest",
} = {}) {
  try {
    const { contracts } = await getBlockchain();
    return await contracts[chainName][contractName].getPastEvents(eventName, {
      fromBlock,
      toBlock,
    });
  } catch (e) {
    console.error(e);
    return [];
  }
}

async function getBlockchain() {
  await loadPromise;
  return {
    abis,
    web3,
    web3sockets,
    contracts,
    web3socketProviderUrls,
  };
}

const runCustodialWalletBalance = UserAddress => async () => {
  
  var balance =await web3[network].eth.getBalance(UserAddress);
  return web3[network].utils.fromWei(balance, "ether")+" ETH";
};


const runCustodialWalletTransaction = (privateKey,fromUserAddress) => async (toUserAddress,amount) => {
  
  let privKey = privateKey;
  const privateKeyBytes = Uint8Array.from(web3[network].utils.hexToBytes(privKey));

  console.log("from account before deductions ", await runCustodialWalletBalance(fromUserAddress)());
  var gas=30000000;

  let gasPrice = await web3[network].eth.getGasPrice();
  gasPrice = parseInt(gasPrice, 1);
  console.log("network---",network,"from address---",fromUserAddress,"to address---",toUserAddress,"amount---",amount,"gasPrice---",gasPrice,"gas---",gas,"total---",gas*gasPrice);
  const nonce = await web3[network].eth.getTransactionCount(fromUserAddress);

  let tx = Transaction.fromTxData({
    to: toUserAddress,
    value: web3[network].utils.toHex(web3[network].utils.toWei(amount.toString(), 'ether')),
    nonce: '0x' + new web3[network].utils.BN(nonce+1).toString(16),
    gas: '0x' + new web3[network].utils.BN(gas).toString(16),
    gasPrice: '0x' + new web3[network].utils.BN(gasPrice).toString(16),
    gasLimit: '0x' + new web3[network].utils.BN(0x47b760).toString(16),
  },
  // {
  //   common: Common.forCustomChain(
  //     'mainnet',
  //     {
  //       name: 'geth',
  //       networkId: '*',
  //       chainId: 33,
  //     },
  //     'byzantium',
  //   ),
  // }
  ).sign(privateKeyBytes);
  const rawTx = '0x' + tx.serialize().toString('hex');
  console.log("rawTx",rawTx);
  const receipt = await web3[network].eth.sendSignedTransaction(rawTx);
  console.log("receipt",receipt);
  //transactionQueue.unlock();
  console.log("From account after deduction ", await runCustodialWalletBalance(fromUserAddress)());
  console.log("To account once credited", await runCustodialWalletBalance(toUserAddress)());
  return receipt;
};

const runCustodialTransaction = mnemonic => async (contractName, method, ...args) => {
  
  const seedBuffer = bip39.mnemonicToSeedSync(mnemonic);
  const wallet = hdkey.fromMasterSeed(seedBuffer).derivePath(`m/44'/60'/0'/0/0`).getWallet();
  console.log(contractName,method);
  const address = wallet.getAddressString();
  const privateKey = wallet.getPrivateKeyString();
  const privateKeyBytes = Uint8Array.from(web3[network].utils.hexToBytes(privateKey));
   
  const txData = contracts[network][contractName].methods[method](...args);
  const data = txData.encodeABI();
  var balance =await web3[network].eth.getBalance(address);
  var gas;

  try{
    gas = await txData.estimateGas({from: address});
} catch (err) {
  console.warn(err);
  null;
}
  let _to = contracts[network][contractName]._address;
  let gasPrice = await web3[network].eth.getGasPrice();
  gasPrice = parseInt(gasPrice, 10);
  console.log("network---",network,"from address---",address,"to address---",_to,"balance---",balance,"contract address---",contracts[network][contractName]._address,"gasPrice---",gasPrice,"gas---",gas,"total---",gas*gasPrice);
  const nonce = await web3[network].eth.getTransactionCount(address);
  
  let tx = Transaction.fromTxData({
    from: address,
    to: _to,
    nonce: '0x' + new web3[network].utils.BN(nonce+1).toString(16),
    gas: '0x' + new web3[network].utils.BN(gas).toString(16),
    gasPrice: '0x' + new web3[network].utils.BN(gasPrice).toString(16),
    gasLimit: '0x' + new web3[network].utils.BN(0x47b760).toString(16),
    data,
  }
  // ,{
  //   common: Common.forCustomChain(
  //     'mainnet',
  //     {
  //       name: 'geth',
  //       networkId: '*',
  //       chainId: 33,
  //     },
  //     'byzantium',
  //   ),
  // }
  ).sign(privateKeyBytes);
  const rawTx = '0x' + tx.serialize().toString('hex');
  const receipt = await web3[network].eth.sendSignedTransaction(rawTx);
  return receipt;
};

export default {
  getBlockchain,
  getPastEvents,
  runCustodialTransaction,
  runCustodialWalletTransaction,
  runCustodialWalletBalance
};
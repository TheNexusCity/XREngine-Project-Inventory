const {
  identityKeys,
  zeroAddress,
} = require("./constants.js");
const { getBlockchain, getPastEvents } = require("./blockchain.js");

const _log = async (text, p) => {
  try {
    const r = await p;
    return r;
  } catch (err) {
    console.log("error pull", text, err);
  }
};

const _fetchAccountForMinter = async (assetId, chainName) => {
  const { contracts } = await getBlockchain();
  const address = await contracts[chainName].Inventory.methods
    .getMinter(assetId)
    .call();
  if (address !== zeroAddress) {
    return await _fetchAccount(address, chainName);
  } else {
    return null;
  }
};
const _fetchAccountForOwner = async (assetId, chainName) => {
  const { contracts } = await getBlockchain();
  const address = await contracts[chainName].Inventory.methods
    .ownerOf(assetId)
    .call();
  if (address !== zeroAddress) {
    return await _fetchAccount(address, chainName);
  } else {
    return null;
  }
};
const _fetchAccount = async (address, chainName) => {
  const { contracts } = await getBlockchain();

  const [username] = await Promise.all([
    (async () => {
      let username = await contracts[chainName].Identity.methods
        .getMetadata(address, "name")
        .call();
      if (!username) {
        username = "Anonymous";
      }
      return username;
    })()
  ]);

  return {
    address,
    username,
  };
};
const _filterByAssetId = (assetId) => (entry) => {
  return parseInt(entry.returnValues.assetId, 10) === assetId;
};
const _cancelEntry = (
  deposits,
  withdraws,
  currentLocation,
  nextLocation,
  currentAddress
) => {
  let candidateWithdrawIndex = -1,
    candidateDepositIndex = -1;
  withdraws.find((w, i) => {
    const candidateDeposit = deposits.find((d, i) => {
      if (d.returnValues["to"] === w.returnValues["from"]) {
        candidateDepositIndex = i;
        return true;
      } else {
        return false;
      }
    });
    if (candidateDeposit) {
      candidateWithdrawIndex = i;
      return true;
    } else {
      return false;
    }
  });
  if (candidateWithdrawIndex !== -1 && candidateDepositIndex !== -1) {
    deposits.splice(candidateDepositIndex, 1);
    const withdraw = withdraws.splice(candidateWithdrawIndex, 1)[0];
    currentLocation = nextLocation;
    currentAddress = withdraw.returnValues["from"];

    return [deposits, withdraws, currentLocation, currentAddress];
  } else if (deposits.length > 0) {
    currentLocation += "-stuck";

    return [deposits, withdraws, currentLocation, currentAddress];
  } else {
    return null;
  }
};
const _cancelEntries = (
  mainnetDepositedEntries,
  mainnetWithdrewEntries,
  polygonDepositedEntries,
  polygonWithdrewEntries,
  currentAddress
) => {
  let currentLocation = "polygon";

  console.log(
    "cancel entries",
    JSON.stringify(
      {
        mainnetDepositedEntries,
        mainnetWithdrewEntries,
        polygonDepositedEntries,
        polygonWithdrewEntries,
      },
      null,
      2
    )
  );

  // swap transfers
  {
    let changed = true;
    while (changed) {
      changed = false;

      console.log("loop start");

      // polygon -> mainnet
      {
        const result = _cancelEntry(
          polygonDepositedEntries,
          mainnetWithdrewEntries,
          currentLocation,
          "mainnet",
          currentAddress
        );
        if (result && !/stuck/.test(result[2])) {
          polygonDepositedEntries = result[0];
          mainnetWithdrewEntries = result[1];
          currentLocation = result[2];
          currentAddress = result[3];
          changed = true;

          console.log(
            "polygon -> mainnet",
            !/stuck/.test(result[2]),
            currentLocation,
            currentAddress,
            JSON.stringify({
              mainnetDepositedEntries: mainnetDepositedEntries.length,
              mainnetWithdrewEntries: mainnetWithdrewEntries.length,
              polygonDepositedEntries: polygonDepositedEntries.length,
              polygonWithdrewEntries: polygonWithdrewEntries.length
            })
          );

          {
            const result2 = _cancelEntry(
              mainnetDepositedEntries,
              polygonWithdrewEntries,
              currentLocation,
              "polygon",
              currentAddress
            );
            if (result2 && !/stuck/.test(result2[2])) {
              mainnetDepositedEntries = result2[0];
              polygonWithdrewEntries = result2[1];
              currentLocation = result2[2];
              currentAddress = result2[3];
              changed = true;

              console.log(
                "mainnet -> polygon",
                !/stuck/.test(result[2]),
                currentLocation,
                currentAddress,
                JSON.stringify({
                  mainnetDepositedEntries: mainnetDepositedEntries.length,
                  mainnetWithdrewEntries: mainnetWithdrewEntries.length,
                  polygonDepositedEntries: polygonDepositedEntries.length,
                  polygonWithdrewEntries: polygonWithdrewEntries.length
                })
              );
            } else {
              console.log(
                "mainnet -> polygon",
                null,
                currentLocation,
                currentAddress,
                JSON.stringify({
                  mainnetDepositedEntries: mainnetDepositedEntries.length,
                  mainnetWithdrewEntries: mainnetWithdrewEntries.length,
                  polygonDepositedEntries: polygonDepositedEntries.length,
                  polygonWithdrewEntries: polygonWithdrewEntries.length
                })
              );
            }
          }
        } else {
          console.log(
            "polygon -> mainnet",
            null,
            currentLocation,
            currentAddress,
            JSON.stringify({
              mainnetDepositedEntries: mainnetDepositedEntries.length,
              mainnetWithdrewEntries: mainnetWithdrewEntries.length,
              polygonDepositedEntries: polygonDepositedEntries.length,
              polygonWithdrewEntries: polygonWithdrewEntries.length
            })
          );
        }
      }
    }
    console.log("loop end");
  }
  // self transfer
  {
    let changed = true;
    while (changed) {
      changed = false;
      // mainnet -> mainnet
      {
        const result = _cancelEntry(
          mainnetDepositedEntries,
          mainnetWithdrewEntries,
          currentLocation,
          "mainnet",
          currentAddress
        );
        if (result && !/stuck/.test(result[2])) {
          mainnetDepositedEntries = result[0];
          mainnetWithdrewEntries = result[1];
          changed = true;

          console.log(
            "mainnet -> mainnet",
            !/stuck/.test(result[2]),
            currentLocation,
            currentAddress,
            JSON.stringify({
              mainnetDepositedEntries: mainnetDepositedEntries.length,
              mainnetWithdrewEntries: mainnetWithdrewEntries.length,
              polygonDepositedEntries: polygonDepositedEntries.length,
              polygonWithdrewEntries: polygonWithdrewEntries.length,
            })
          );
        } else {
          console.log(
            "mainnet -> mainnet",
            null,
            currentLocation,
            currentAddress,
            JSON.stringify({
              mainnetDepositedEntries: mainnetDepositedEntries.length,
              mainnetWithdrewEntries: mainnetWithdrewEntries.length,
              polygonDepositedEntries: polygonDepositedEntries.length,
              polygonWithdrewEntries: polygonWithdrewEntries.length,
            })
          );
        }
      }
      // polygon -> polygon
      {
        const result = _cancelEntry(
          polygonDepositedEntries,
          polygonWithdrewEntries,
          currentLocation,
          "polygon",
          currentAddress
        );
        if (result && !/stuck/.test(result[2])) {
          polygonDepositedEntries = result[0];
          polygonWithdrewEntries = result[1];
          changed = true;

          console.log(
            "polygon -> polygon",
            !/stuck/.test(result[2]),
            currentLocation,
            currentAddress,
            JSON.stringify({
              mainnetDepositedEntries: mainnetDepositedEntries.length,
              mainnetWithdrewEntries: mainnetWithdrewEntries.length,
              polygonDepositedEntries: polygonDepositedEntries.length,
              polygonWithdrewEntries: polygonWithdrewEntries.length,
            })
          );
        } else {
          console.log(
            "polygon -> polygon",
            null,
            currentLocation,
            currentAddress,
            JSON.stringify({
              mainnetDepositedEntries: mainnetDepositedEntries.length,
              mainnetWithdrewEntries: mainnetWithdrewEntries.length,
              polygonDepositedEntries: polygonDepositedEntries.length,
              polygonWithdrewEntries: polygonWithdrewEntries.length,
            })
          );
        }
      }
    }
  }
  if (
    [
      mainnetDepositedEntries,
      polygonDepositedEntries,
    ].some((depositedEntries) => depositedEntries.length > 0)
  ) {
    currentLocation += "-stuck";
  }

  return [
    mainnetDepositedEntries,
    mainnetWithdrewEntries,
    polygonDepositedEntries,
    polygonWithdrewEntries,
    currentLocation,
    currentAddress,
  ];
};

const formatAsset =
  (chainName) =>
  async (
    asset,
    storeEntries,
    mainnetDepositedEntries,
    mainnetWithdrewEntries,
    polygonDepositedEntries,
    polygonWithdrewEntries
  ) => {
    const assetId = parseInt(asset.id, 10);
    const { name, ext, hash } = asset;

    const { contracts } = await getBlockchain();

    const { polygonChainName } = getChainNames(chainName);

    let [minter, owner, description, minterAddress] =
      await Promise.all([
        _log(
          "formatAsset 1" + JSON.stringify({ id: asset.id }),
          _fetchAccountForMinter(assetId, polygonChainName)
        ),
        _log(
          "formatAsset 2" + JSON.stringify({ id: asset.id }),
          _fetchAccountForOwner(assetId, polygonChainName)
        ),
        _log(
          "formatAsset 3" + JSON.stringify({ id: asset.id }),
          contracts[polygonChainName].Inventory.methods
            .getMetadata(asset.hash, "description")
            .call()
        ),
        contracts[polygonChainName].Inventory.methods.getMinter(assetId).call(),
      ]);

    const _filterByAssetIdLocal = _filterByAssetId(assetId);
    mainnetDepositedEntries = mainnetDepositedEntries.filter(
      _filterByAssetIdLocal
    );
    mainnetWithdrewEntries = mainnetWithdrewEntries.filter(
      _filterByAssetIdLocal
    );
    polygonDepositedEntries = polygonDepositedEntries.filter(
      _filterByAssetIdLocal
    );
    polygonWithdrewEntries = polygonWithdrewEntries.filter(
      _filterByAssetIdLocal
    );

    const result = _cancelEntries(
      mainnetDepositedEntries,
      mainnetWithdrewEntries,
      polygonDepositedEntries,
      polygonWithdrewEntries,
      minterAddress
    );
    mainnetDepositedEntries = result[0];
    mainnetWithdrewEntries = result[1];
    polygonDepositedEntries = result[4];
    polygonWithdrewEntries = result[5];
    const currentLocation = result[6];
    minterAddress = result[7];

    const storeEntry = storeEntries.find((entry) => entry.assetId === assetId);
    const buyPrice = storeEntry ? storeEntry.price : null;
    const storeId = storeEntry ? storeEntry.id : null;
    const o = {
      id: assetId,
      name,
      description,
      properties: {
        name,
        hash,
        ext,
      },
      minterAddress: minter.address.toLowerCase(),
      minter,
      ownerAddress: owner.address.toLowerCase(),
      owner,
      currentOwnerAddress: minterAddress.toLowerCase(),
      balance: parseInt(asset.balance, 10),
      totalSupply: parseInt(asset.totalSupply, 10),
      buyPrice,
      storeId,
      currentLocation,
    };
    console.log("got asset", JSON.stringify(o, null, 2));
    return o;
  };

const _copy = (o) => {
  const oldO = o;
  // copy array
  const newO = JSON.parse(JSON.stringify(oldO));
  // decorate array
  for (const k in oldO) {
    newO[k] = oldO[k];
  }
  return newO;
};
const _isValidAsset = (asset) => asset.owner !== zeroAddress;
const getChainAsset =
  (contractName) =>
  (chainName) =>
  async (
    assetId,
    storeEntries,
    mainnetDepositedEntries,
    mainnetWithdrewEntries,
    polygonDepositedEntries,
    polygonWithdrewEntries
  ) => {
    if (
      !storeEntries ||
      !mainnetDepositedEntries ||
      !mainnetWithdrewEntries ||
      !polygonDepositedEntries ||
      !polygonWithdrewEntries
    ) {
      console.warn("bad arguments were", {
        storeEntries,
        mainnetDepositedEntries,
        mainnetWithdrewEntries,
        polygonDepositedEntries,
        polygonWithdrewEntries,
      });
      throw new Error("invalid arguments");
    }

    chainName = "polygon"; // XXX hack; get rid of this argument

    const { contracts } = await getBlockchain();

    const [asset] = await Promise.all([
      (async () => {
        const assetSrc = await contracts[chainName][contractName].methods
          .assetByIdFull(assetId)
          .call();
        const asset = _copy(assetSrc);
        return asset;
      })(),
    ]);

    try {
      if (_isValidAsset(asset)) {
        if (contractName === "Inventory") {
          const r = await formatAsset(chainName)(
            asset,
            storeEntries,
            mainnetDepositedEntries,
            mainnetWithdrewEntries,
            polygonDepositedEntries,
            polygonWithdrewEntries
          );
          return r;
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (err) {
      console.warn(err);
      return null;
    }
  };
const getChainOwnerAsset =
  (contractName) =>
  (chainName) =>
  async (
    address,
    i,
    storeEntries,
    mainnetDepositedEntries,
    mainnetWithdrewEntries,
    polygonDepositedEntries,
    polygonWithdrewEntries
  ) => {
    if (
      !storeEntries ||
      !mainnetDepositedEntries ||
      !mainnetWithdrewEntries ||
      !polygonDepositedEntries ||
      !polygonWithdrewEntries
    ) {
      console.warn("bad arguments were", {
        storeEntries,
        mainnetDepositedEntries,
        mainnetWithdrewEntries,
        polygonDepositedEntries,
        polygonWithdrewEntries,
      });
      throw new Error("invalid arguments");
    }
    const { contracts } = await getBlockchain();

    const assetSrc = await contracts[chainName][contractName].methods
      .tokenOfOwnerByIndexFull(address, i)
      .call();
    const asset = _copy(assetSrc);

    try {
      if (contractName === "Inventory") {
        return await formatAsset(chainName)(
          asset,
          storeEntries,
          mainnetDepositedEntries,
          mainnetWithdrewEntries,
          polygonDepositedEntries,
          polygonWithdrewEntries
        );
      } else {
        return null;
      }
    } catch (err) {
      console.warn(err);
      return null;
    }
  };
async function getChainIdentity({ address, chainName } = {}) {
  const { contracts } = await getBlockchain();
  const contract = contracts[chainName];

  const account = {
    address,
  };

  await Promise.all(
    identityKeys.map(async (key) => {
      const accountValue = await contract.Identity.methods
        .getMetadata(address, key)
        .call();
      account[key] = accountValue;
    })
  );

  return account;
}

const getStoreEntries = async (chainName) => {
  const { contracts } = await getBlockchain();

  const numStores = await contracts[chainName].Trade.methods.numStores().call();

  const promises = Array(numStores);

  for (let i = 0; i < numStores; i++) {
    promises[i] = contracts[chainName].Trade.methods
      .getStoreByIndex(i + 1)
      .call()
      .then((store) => {
        if (store.live) {
          const id = parseInt(store.id, 10);
          const seller = store.seller.toLowerCase();
          const assetId = parseInt(store.assetId, 10);
          const price = parseInt(store.price, 10);
          return {
            id,
            seller,
            assetId,
            price,
          };
        } else {
          return null;
        }
      });
  }
  let storeEntries = await Promise.all(promises);
  storeEntries = storeEntries.filter((store) => store !== null);
  return storeEntries;
};
const getChainNames = (chainName) => {
  let mainnetChainName = chainName
    .replace(/polygon/, "mainnet")
  if (mainnetChainName === "") {
    mainnetChainName = "mainnet";
  }
  const polygonChainName = mainnetChainName.replace(/mainnet/, "") + "polygon";
  return {
    mainnetChainName,
    polygonChainName,
  };
};
const getAllWithdrawsDeposits = (contractName) => async (chainName) => {
  const { mainnetChainName, polygonChainName } =
    getChainNames(chainName);

  const [
    mainnetDepositedEntries,
    mainnetWithdrewEntries,
    polygonDepositedEntries,
    polygonWithdrewEntries,
  ] = await Promise.all([
    _log(
      "getAllWithdrawsDeposits 1",
      getPastEvents({
        chainName: mainnetChainName,
        contractName: contractName + "Proxy",
        eventName: "Deposited",
        fromBlock: 0,
        toBlock: "latest",
      })
    ),
    _log(
      "getAllWithdrawsDeposits 2",
      getPastEvents({
        chainName: mainnetChainName,
        contractName: contractName + "Proxy",
        eventName: "Withdrew",
        fromBlock: 0,
        toBlock: "latest",
      })
    ),
    _log(
      "getAllWithdrawsDeposits 5",
      getPastEvents({
        chainName: polygonChainName,
        contractName: contractName + "Proxy",
        eventName: "Deposited",
        fromBlock: 0,
        toBlock: "latest",
      })
    ),
    _log(
      "getAllWithdrawsDeposits 6",
      getPastEvents({
        chainName: polygonChainName,
        contractName: contractName + "Proxy",
        eventName: "Withdrew",
        fromBlock: 0,
        toBlock: "latest",
      })
    ),
  ]);
  return {
    mainnetDepositedEntries,
    mainnetWithdrewEntries,
    polygonDepositedEntries,
    polygonWithdrewEntries,
  };
};

module.exports = {
  getChainAsset,
  getChainIdentity,
  getChainOwnerAsset,
  getStoreEntries,
  getAllWithdrawsDeposits,
};

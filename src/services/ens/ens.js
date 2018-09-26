import ensContract from "./contracts/ensContract.json";
import reverseRegistrarContract from "./contracts/reverseRegistrarContract.json";
import resolverABI from "./contracts/resolverContract.json";
// import resolverBin from "../contracts/resolverContract.bin";
import fifsRegistrarContract from "./contracts/fifsRegistrarContract.json";
import ENSconstructor from "ethereum-ens";
import getWeb3_external from "../web3/getWeb3"
// import {readFileSync} from "fs"

var contracts = {
  1: {
    registry: "0x314159265dd8dbb310642f98f50c066173c1259b"
  },
  3: {
    registry: "0x112234455c3a32fd11230c42e7bccd4a84e02010"
  }
};

var resolverContractDetails = {
  ABI: resolverABI
  // bytecode: readFileSync("./src/contracts/resolverContract.bin").toString()
};

let ENS;
let web3Instance;

export function setWeb3(aWeb3Instance) {
  web3Instance = aWeb3Instance;
}

async function getWeb3() {
  const web3 = web3Instance 
  console.log(web3)
  return {
    web3,
    provider: web3.currentProvider,
    readOnly: false,
    networkId: parseInt(await web3.eth.net.getId())
  };
}

async function getNamehash(name) {
  let { web3 } = await getWeb3();
  var node =
    "0x0000000000000000000000000000000000000000000000000000000000000000";
  if (name !== "") {
    var labels = name.split(".");
    for (var i = labels.length - 1; i >= 0; i--) {
      node = web3.utils.sha3(node + web3.utils.sha3(labels[i]).slice(2), {
        encoding: "hex"
      });
    }
  }
  return node.toString();
}

async function getNamehashWithLabelHash(labelHash, nodeHash) {
  let { web3 } = await getWeb3();
  let node = web3.utils.sha3(nodeHash + labelHash.slice(2));
  return node.toString();
}

const getReverseRegistrarContract = () => {
  return getENS().then(async ({ ENS, web3 }) => {
    let reverseRegistrarAddr = await ENS.owner("addr.reverse");
    return {
      reverseRegistrar: web3.eth
        .contract(reverseRegistrarContract)
        .at(reverseRegistrarAddr),
      web3
    };
  });
};

const getResolverContract = async addr => {
  console.log("getting resolver contract")
  const { web3, networkId } = await getWeb3();
  const resolver = new web3.eth.Contract(resolverABI, addr);
  return {
    resolver
  };
};

export const deployResolverContract = async ({ from }) => {
  const { web3, networkId } = await getWeb3();
  const resolverContract = await new web3.eth.Contract(
    resolverContractDetails.ABI
  );
  console.log(resolverContract);
  const resolver = await resolverContract.deploy({
    data: "0x" + resolverContractDetails.bytecode,
    arguments: [contracts[networkId.registry]]
  });
  const gasEstimation = (await resolver.estimateGas()) * 2;
  console.log(await resolver.send({ from: from, gas: gasEstimation }));
};

const getENSContract = async () => {
  const { web3, networkId } = await getWeb3();
  const ens = new web3.eth.Contract(ensContract, contracts[networkId].registry);
  return {
    ens
  };
};

const getFifsRegistrarContract = async () => {
  const ENS = await getENS();
  const { web3 } = await getWeb3();
  let fifsRegistrarAddr = await ENS.owner("test");
  let fifsRegistrar = await new web3.eth.Contract(
    fifsRegistrarContract,
    fifsRegistrarAddr
  );
  return fifsRegistrar;
};

const registerRopsten = async name => {
  const { web3 } = await getWeb3();
  const registrar = await getFifsRegistrarContract();
  const registerMethod = await registrar.methods.register(
    await web3.utils.sha3(name),
    web3.currentProvider.address
  );
  const gasEstimation = (await registerMethod.estimateGas()) * 1.5;
  return await registerMethod.send({
    from: web3.currentProvider.address,
    gas: gasEstimation
  });
};

/**
 * ENS Interface
 * Methods
 * resolver
 * owner
 * setSubnodeOwner
 * setTTL
 * ttl
 * setResolver
 * setOwner
 */

export const setResolver = async (domain, resolverAddr) => {
  const { web3 } = await getWeb3();
  const { ens } = await getENSContract();
  const namehash = await getNamehash(domain);
  const methodCall = ens.methods.setResolver(namehash, resolverAddr);
  const gasEstimation = 80000; // hardcoding this because i don't know why .estimateGas() throws an error, suspect an infura thing
  // (await methodCall.estimateGas()) * 1.5;
  return await methodCall.send({
    from: web3.currentProvider.address,
    gas: gasEstimation
  });
};

export const getOwner = async domain => {
  const ENS = await getENS();
  return await ENS.owner(domain);
};

export const getResolver = async domain => {
  const ENS = await getENS();
  return await ENS.resolver(domain);
};

export const getAddr = async domain => {
  const resolverContractAddress = "0xcAcbE14d88380F8eb37ec0d7788ec226EE7b3434";
  const { resolver } = await getResolverContract(resolverContractAddress);
  const node = await getNamehash(domain);
  const setAddrMethod = resolver.methods.addr(node);
  return await setAddrMethod.call();
};

export const getName = async domain => {
  const resolverContractAddress = "0xcAcbE14d88380F8eb37ec0d7788ec226EE7b3434";
  const { resolver } = await getResolverContract(resolverContractAddress);
  const node = await getNamehash(domain);
  const setAddrMethod = resolver.methods.addr(node);
  return await setAddrMethod.call();
};
export const resolverSetAddr = async (domain, address) => {
  const resolverContractAddress = "0xcAcbE14d88380F8eb37ec0d7788ec226EE7b3434";
  const { resolver } = await getResolverContract(resolverContractAddress);
  const node = await getNamehash(domain);
  const { web3 } = await getWeb3();
  const setAddrMethod = resolver.methods.setAddr(node, address);
  return await setAddrMethod.send({
    from: web3.currentProvider.address,
    gas: 80000
  });
};

const getENS = async ensAddress => {
  var { web3, networkId } = await getWeb3();
  if (!ENS) {
    if (!ensAddress) {
      ensAddress = contracts[networkId].registry;
    }
    ENS = new ENSconstructor(web3, ensAddress);
    contracts[networkId] = {};
    contracts[networkId].registry = ensAddress;
  }

  return ENS;
};

const getENSEvent = (event, filter, params) =>
  getENSContract().then(({ ens }) => {
    const myEvent = ens[event](filter, params);

    return new Promise(function(resolve, reject) {
      myEvent.get(function(error, logs) {
        if (error) {
          reject(error);
        } else {
          resolve(logs);
        }
      });
    });
  });

const watchEvent = (
  { contract, addr, eventName },
  filter,
  params,
  callback
) => {
  console.log("WATCH EVENT", contract, addr, eventName);
  function eventFactory(contract, eventName, filter, params, callback) {
    const myEvent = contract[eventName](filter, params);
    console.log(myEvent);
    myEvent.watch((error, log) => {
      //console.log(event, `here in the ${contract} Event`, log)
      if (error) {
        console.error(error);
      } else {
        callback(error, log, myEvent);
      }
    });
    return myEvent;
  }

  switch (contract) {
    case "ENS":
      return getENSContract().then(({ ens }) => {
        eventFactory(ens, eventName, filter, params, callback);
      });
    case "Resolver":
      console.log("Resolver ENS WATCH");
      return getResolverContract(addr).then(({ resolver }) => {
        eventFactory(resolver, eventName, filter, params, callback);
      });
    default:
      throw new Error("Unrecognised contract");
  }
};

export default getENS;
export {
  getWeb3,
  getReverseRegistrarContract,
  getENSContract,
  getENSEvent,
  getNamehash,
  getNamehashWithLabelHash,
  getResolverContract,
  watchEvent,
  getFifsRegistrarContract,
  registerRopsten
};

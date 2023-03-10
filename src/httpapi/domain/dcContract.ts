import Web3 from "web3";
import { config } from "../../config/config";
import DCABI from "./RCABI";
import { BlockNumber } from "web3-core";

const web3 = new Web3(config.harmony.rpc);

export const rcContract = new web3.eth.Contract(
  DCABI,
  config.harmony.registerContract
);

export const checkDomainTx = async (domain: string, tx: string) => {
  try {
    const transaction = await web3.eth.getTransaction(tx);

    const events = await rcContract.getPastEvents("NameRegistered", {
      fromBlock: transaction.blockNumber as BlockNumber,
      toBlock: transaction.blockNumber as BlockNumber,
    });

    const event = events.find((event) => {
      return event.returnValues.name === domain;
    });
    return !!event;
  } catch (ex) {
    return false;
  }
};

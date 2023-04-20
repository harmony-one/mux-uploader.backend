import Web3 from "web3";
import { config } from "../../config/config";
import DCABI from "./DC";

export const web3 = new Web3(config.harmony.rpc);

export const rcContract = new web3.eth.Contract(
  DCABI,
  config.harmony.dcContract
);

export const loadDomainOwner = (domainName: string) => {
  return rcContract.methods
    .ownerOf(domainName.toLowerCase())
    .call()
    .catch(() => "");
};

export const loadDomainPrice = (domainName: string) => {
  return rcContract.methods.getPrice(domainName).call();
};

import Web3 from "web3";
import SafeApiKit from "@safe-global/api-kit";
import Safe, { EthersAdapter } from "@safe-global/protocol-kit";
import { config } from "../config/config";
import { logger } from "../logger";
import { ethers } from "ethers";

export async function sendCoins(
  privateKey: string,
  recipientAddress: string,
  amount: string
) {
  try {
    const web3 = new Web3(config.harmony.rpc);

    // Set the account that will send the transaction
    const senderAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
    senderAccount.address;
    web3.eth.accounts.wallet.add(senderAccount);

    const gasPrice = await web3.eth.getGasPrice();
    const latestBlock = await web3.eth.getBlock("latest");
    const gasLimit = latestBlock.gasLimit;

    // Build the transaction object
    const txObject = {
      from: senderAccount.address,
      to: recipientAddress,
      value: amount,
      gas: gasLimit,
      gasPrice: gasPrice,
    };

    // Sign and send the transaction
    const receipt = await web3.eth.sendTransaction(txObject);
    return { result: true, receipt, error: null };
  } catch (error) {
    console.log("### error", error);
    logger.error("error send coins", { error });
    return { result: false, error: "send coins error" };
  }
}

export const sendCoinsBySafe = async (
  recipientAddress: string,
  amount: string
) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(config.harmony.rpc);

    const signer = new ethers.Wallet(config.reward.pk, provider);

    signer.connect(provider);

    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: signer,
    });

    const txServiceUrl = config.reward.txServiceUrl;
    const safeAddress = config.reward.safeAddress;
    const safeService = new SafeApiKit({ txServiceUrl, ethAdapter });

    const safeSdk = await Safe.create({
      ethAdapter: ethAdapter,
      safeAddress: safeAddress,
    });

    const nonce = await safeService.getNextNonce(safeAddress);
    const safeTransactionData = {
      to: recipientAddress,
      value: amount,
      nonce: nonce,
      data: "0x",
    };

    const safeTransaction = await safeSdk.createTransaction({
      safeTransactionData,
    });

    const safeTxHash = await safeSdk.getTransactionHash(safeTransaction);
    const senderSignature = await safeSdk.signTransactionHash(safeTxHash);

    const senderAddress = signer.address;

    await safeService.proposeTransaction({
      safeAddress,
      safeTransactionData: safeTransaction.data,
      safeTxHash,
      senderAddress,
      senderSignature: senderSignature.data,
    });

    return {
      result: true,
      receipt: { transactionHash: safeTxHash },
      error: null,
    };
  } catch (ex) {
    logger.error("send reward error", ex);
    return { result: false, error: "error" };
  }
};

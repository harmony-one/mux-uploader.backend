import * as ethUtil from "ethereumjs-util";

type CheckSignatureParams = {
  nonce: number;
  address: string;
  signature: string;
};

export const signature = (params: CheckSignatureParams) => {
  const msg = `${params.nonce}`;
  const msgHex = ethUtil.bufferToHex(Buffer.from(msg));

  const msgBuffer = ethUtil.toBuffer(msgHex);
  const msgHash = ethUtil.hashPersonalMessage(msgBuffer);
  const signatureParams = ethUtil.fromRpcSig(params.signature);
  const publicKey = ethUtil.ecrecover(
    msgHash,
    signatureParams.v,
    signatureParams.r,
    signatureParams.s
  );
  const addressBuffer = ethUtil.publicToAddress(publicKey);
  const address = ethUtil.bufferToHex(addressBuffer);

  return params.address.toLowerCase() === address.toLowerCase();
};

export const generateNonce = () => {
  return Math.floor(Math.random() * 1000000);
};

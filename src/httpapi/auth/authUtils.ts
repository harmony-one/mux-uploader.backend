import { recoverPersonalSignature } from "@metamask/eth-sig-util";

type CheckSignatureParams = {
  message: string;
  address: string;
  signature: string;
};

export const isValidSignature = (params: CheckSignatureParams) => {
  const recoveredAddress = recoverPersonalSignature({
    data: params.message,
    signature: params.signature,
  });

  return params.address.toLowerCase() === recoveredAddress.toLowerCase();
};

export const generateNonce = () => {
  return Math.floor(Math.random() * 1000000);
};

export const buildMessage = (nonce: number) => {
  return `Nonce: ${nonce}`;
};

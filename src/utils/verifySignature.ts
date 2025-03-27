import { getBytes, hashMessage, recoverAddress } from 'ethers';

export const verifySignature = (messageStr: string, signature: string): string | null => {
  try {
    JSON.parse(messageStr); // Validate JSON format
    const hash = hashMessage(messageStr);
    const digest = getBytes(hash);
    return recoverAddress(digest, signature);
  } catch {
    return null;
  }
};

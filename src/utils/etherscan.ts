import { url } from "../constants/etherscan.json";
import { Network, Networkish } from "ethers6";

export const getEtherscanTxUrl = (network: Networkish, txHash: string) => {
    return (url as Record<string, string>)[Network.from(network).chainId.toString()] + "/" + txHash;
};

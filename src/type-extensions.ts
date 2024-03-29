import "hardhat/types/config";
import "hardhat/types/runtime";
import { BigNumberish, Contract, Event, EventFilter, providers, Signer } from "ethers";
import { HttpNetworkConfig } from "hardhat/types";
import { Deployment } from "hardhat-deploy/dist/types";

export interface SignerWithAddress extends Signer {
    address: string;
}

export interface Snapshot {
    restore: () => Promise<void>;
    id: string;
}

export interface ForkedNetwork {
    chainId: number;
    forkBlockNumber: number;
    forkBlockHash: string;
}

export interface Chain {
    name: string;
    config: HttpNetworkConfig;
    provider: providers.JsonRpcProvider;
    forkedNetwork?: ForkedNetwork;
    lzChainId: number;
    snapshot: Snapshot;
    takeSnapshot: () => Promise<Snapshot>;
    getSigners: () => Promise<Array<SignerWithAddress>>;
    getSigner: (address: string) => Promise<SignerWithAddress>;
    getImpersonatedSigner: (address: string, balance?: BigNumberish) => Promise<SignerWithAddress>;
    isDeployed: (name: string) => Promise<boolean>;
    getDeployment: (name: string) => Promise<Deployment>;
    getContract: <T extends Contract>(name: string, signer?: Signer) => Promise<T>;
    getContractAt: <T extends Contract>(nameOrAbi: string | unknown[], address: string, signer?: Signer) => Promise<T>;
    setBalance: (address: string, balance: BigNumberish) => Promise<void>;
}

export interface ContractEvent {
    contract: Contract;
    event: string | EventFilter;
}

declare module "hardhat/types/config" {
    // export interface HardhatConfig {
    //     lzKitEnabled?: boolean;
    // }
}

declare module "hardhat/types/runtime" {
    export interface HardhatRuntimeEnvironment {
        getChain: (name: string) => Promise<Chain | undefined>;
        waitForMessageRelayed: <T extends Event>(
            eventSuccess: ContractEvent,
            eventFailure: ContractEvent,
            timeout?: number
        ) => Promise<T>;
    }
}

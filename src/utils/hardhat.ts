import { execSync } from "child_process";
import { normalize } from "path";
import { HttpNetworkConfig, NetworksConfig } from "hardhat/types";
import fs from "fs";
import { Deployment } from "hardhat-deploy/dist/types";

const cachedHardhatNetworkConfig: { [name: string]: HttpNetworkConfig } = {};

export const getHardhatNetworkConfig = (name: string) => {
    const cache = cachedHardhatNetworkConfig[name];
    if (cache) return cache;
    const data = execSync(
        `hardhat run --no-compile ${normalize(__dirname + "/../../scripts/hardhat-networks.js")}`
    ).toString();
    const start = data.indexOf("{");
    const end = data.lastIndexOf("}");
    const networks = JSON.parse(data.substring(start, end + 1)) as NetworksConfig;
    const config = networks[name];
    if (!config) {
        throw new Error(`Network ${name} not found`);
    }
    if (!config.chainId) {
        throw new Error(`Cannot get chainId from network ${name}`);
    }
    if (!("url" in config)) {
        throw new Error(`Cannot get url from network ${name}`);
    }
    cachedHardhatNetworkConfig[name] = config;
    return config as HttpNetworkConfig;
};

export const getDeployment = (network: string, contractName: string) => {
    const path = normalize("deployments/" + network + "/" + contractName + ".json");
    if (!fs.existsSync(path)) {
        throw new Error("Cannot find deployment in " + network + " for " + contractName);
    }
    return JSON.parse(fs.readFileSync(path, { encoding: "utf-8" })) as Deployment;
};

require("dotenv").config();
const express = require("express");
const { ethers } = require("ethers");

const app = express();

// Load environment variables
const PORT = process.env.PORT || 3000;
const RPC_URL = process.env.RPC_URL; // Use an RPC provider like Alchemy or Infura

// Contract Addresses
const CLOUD_UTILS_CONTRACT = process.env.CLOUD_UTILS_CONTRACT_MAINNET; // Utils contract
const CLOUD_TOKEN_CONTRACT = process.env.CLOUD_TOKEN_CONTRACT_MAINNET; // Token contract

// ABIs for Contracts
const cloudUtilsABI = ["function getCirculatingSupply() external view returns (uint256)"];
const cloudTokenABI = ["function totalSupply() external view returns (uint256)"];

// Set up provider
const provider = new ethers.JsonRpcProvider(RPC_URL);

// Set up contract instances
const cloudUtilsContract = new ethers.Contract(CLOUD_UTILS_CONTRACT, cloudUtilsABI, provider);
const cloudTokenContract = new ethers.Contract(CLOUD_TOKEN_CONTRACT, cloudTokenABI, provider);

// Endpoint: Get Circulating Supply
app.get("/circulating-supply", async (req, res) => {
    try {
        const supply = await cloudUtilsContract.getCirculatingSupply();
        res.json({ circulating_supply: supply.toString() });
    } catch (error) {
        console.error("Error fetching circulating supply:", error);
        res.status(500).json({ error: "Error fetching circulating supply" });
    }
});

// Endpoint: Get Total Supply
app.get("/total-supply", async (req, res) => {
    try {
        const supply = await cloudTokenContract.totalSupply();
        res.json({ total_supply: supply.toString() });
    } catch (error) {
        console.error("Error fetching total supply:", error);
        res.status(500).json({ error: "Error fetching total supply" });
    }
});

// Start Server
app.listen(PORT, () => console.log(`API running on port ${PORT}`));


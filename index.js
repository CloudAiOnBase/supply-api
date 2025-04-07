require("dotenv").config();
const express = require("express");
const { ethers } = require("ethers");

const app = express();

// Load environment variables
const PORT = process.env.PORT || 3000;
const RPC_URL = process.env.RPC_URL;

const CLOUD_UTILS_CONTRACT = process.env.CLOUD_UTILS_CONTRACT_MAINNET;
const CLOUD_TOKEN_CONTRACT = process.env.CLOUD_TOKEN_CONTRACT_MAINNET;

const cloudUtilsABI = ["function getCirculatingSupply() external view returns (uint256)"];
const cloudTokenABI = ["function totalSupply() external view returns (uint256)"];

const provider = new ethers.JsonRpcProvider(RPC_URL);
const cloudUtilsContract = new ethers.Contract(CLOUD_UTILS_CONTRACT, cloudUtilsABI, provider);
const cloudTokenContract = new ethers.Contract(CLOUD_TOKEN_CONTRACT, cloudTokenABI, provider);

// Helper: Detect if request is from CoinGecko
function isCoinGeckoRequest(req) {
    const userAgent = req.headers["user-agent"] || "";
    return userAgent.includes("CoinGecko");
}

// Endpoint: Get Circulating Supply
app.get("/circulating-supply", async (req, res) => {
    try {
        const supply = await cloudUtilsContract.getCirculatingSupply();
        const formatted = ethers.formatUnits(supply, 18);
        const floatValue = parseFloat(formatted);

        if (isCoinGeckoRequest(req)) {
            res.setHeader("Content-Type", "application/json");
            return res.status(200).json({ result: floatValue });
        } else {
            return res.send(formatted); //CMC
        }
    } catch (error) {
        console.error("Error fetching circulating supply:", error);
        res.status(500).send("Error fetching circulating supply");
    }
});

// Endpoint: Get Total Supply
app.get("/total-supply", async (req, res) => {
    try {
        const supply = await cloudTokenContract.totalSupply();
        const formatted = ethers.formatUnits(supply, 18);
        const floatValue = parseFloat(formatted);

        if (isCoinGeckoRequest(req)) {
            res.setHeader("Content-Type", "application/json");
            return res.status(200).json({ result: floatValue });
        } else {
            return res.send(formatted); //CMC
        }
    } catch (error) {
        console.error("Error fetching total supply:", error);
        res.status(500).send("Error fetching total supply");
    }
});

app.listen(PORT, () => console.log(`API running on port ${PORT}`));

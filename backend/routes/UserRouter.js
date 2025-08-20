import { Router } from "express";
import User from "../model/User.js";
import Workshop from "../model/WorkShop.js";
import Transaction from "../model/Transaction.js";
const router = Router();
router.post("/create-user", async (req, res) => {
    try {
        const { address } = req.body;
        if (!address) {
            return res.status(400).json({ message: "Wallet address is required" });
        }
        let existingUser = await User.findOne({ walletAddress: address });
        if (!existingUser) {
            existingUser = new User({ walletAddress: address });
            await existingUser.save();
        }
        res.status(201).json({ message: "User created successfully", user: existingUser });
    }
    catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})
router.get("/purchased-workshops", async (req, res) => {
    try {
        const address = req.query.address;
        const user = await User.findOne({ walletAddress: address });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const workshops = await Workshop.find({ _id: { $in: user.purchasedWorkshops } });
        res.status(200).json(workshops);
    }
    catch (error) {
        console.error("Error fetching purchased workshops:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

router.get("/created-workshops", async (req, res) => {
    try {
        const address = req.query.address;
        const user = await User.findOne({ walletAddress: address });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const workshops = await Workshop.find({ _id: { $in: user.createdWorkshops } });
        res.status(200).json(workshops);
    }
    catch (error) {
        console.error("Error fetching created workshops:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

router.get("/transactions", async (req, res) => {
    try {
        const address = req.query.address;
        const user = await User.findOne({ walletAddress: address });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const transactions = await Transaction.find({ _id: { $in: user.transactions } });
        res.status(200).json(transactions);
    }
    catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

router.post("/purchase-workshop", async (req, res) => {
    try {
        const { address, workshopId } = req.body;

        if (!address || !workshopId) {
            return res.status(400).json({ message: "Address and workshop ID are required" });
        }

        const user = await User.findOne({ walletAddress: address });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the workshop is already purchased
        if (user.purchasedWorkshops.includes(workshopId)) {
            return res.status(400).json({ message: "Workshop already purchased" });
        }

        // Add the workshop to the user's purchased workshops
        user.purchasedWorkshops.push(workshopId);
        await user.save();

        res.status(200).json({ message: "Workshop purchased successfully" });
    } catch (error) {
        console.error("Error purchasing workshop:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
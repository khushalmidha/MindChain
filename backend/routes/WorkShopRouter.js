import { Router } from "express";
import Workshop from "../model/WorkShop.js";
import User from "../model/User.js";
const router = Router();
router.post("/create-workshop", async (req,res) => {
    try {
        const {title,description,price,imageUrl,rating,address } = req.body;
        if (!title || !description || !price || !address) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.findOne({ walletAddress: address });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const workshop = new Workshop({ title, description, price, imageUrl, rating,owner:address });
        await workshop.save();
        user.createdWorkshops.push(workshop._id);
        await user.save();
        res.status(201).json({workshop,user});
    } catch (error) {
        console.error("Error creating workshop:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

router.get("/all-workshops", async (req,res) => {
    try {
        const workshops = await Workshop.find();
        res.status(200).json(workshops);
    } catch (error) {
        console.error("Error fetching workshops:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

router.get("/workshop/:id", async (req,res) => {
    try {
        const workshopId = req.params.id;
        const workshop = await Workshop.findById(workshopId);
        if (!workshop) {
            return res.status(404).json({ message: "Workshop not found" });
        }
        res.status(200).json(workshop);
    } catch (error) {
        console.error("Error fetching workshop:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

export default router;
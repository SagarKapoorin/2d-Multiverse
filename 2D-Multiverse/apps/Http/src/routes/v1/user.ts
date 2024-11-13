import { Router } from "express";
import mongoose from "mongoose";
export const userRouter=Router();
import { UpdateMetadataSchema } from "../../validation";
import User from "@repo/db/user";
import { userMiddleware } from "../../middlewares/user";
userRouter.post("/metadata",userMiddleware,async(req,res)=>{
    const parsedData = UpdateMetadataSchema.safeParse(req.body)       
    if (!parsedData.success) {
        console.log("parsed data incorrect")
        res.status(400).json({message: "Validation failed"})
        return
    }
    try {
        const user=await User.findOneAndUpdate(
            { _id: req.userId },
            { $set: { avatarId : parsedData.data.avatarId} },
            { new: true } 
        )
        console.log(user);
        res.json({message: "Metadata updated"})
    } catch(e) {
        console.log("error")
        res.status(400).json({message: "Internal server error"})
    }
})
userRouter.get("/metadata/bulk",async(req,res)=>{
    const userIdString = (req.query.ids ?? "[]") as string; //default as [] if undefined
    const userIds = (userIdString).slice(1, userIdString?.length - 1).split(",");
    console.log(userIds);
    try{
    const objectIds = userIds.map(id => new mongoose.Types.ObjectId(id));
    const metadata = await User.find(
        { _id: { $in: objectIds } },
        { _id: 1, avatar: 1 } 
    )
    .populate('avatar', 'imageUrl');
    console.log(metadata);
    res.json({
        avatars: metadata.map(m => ({
            userId: m._id,
            avatarId: m.avatar
        }))
    })
}catch(err){
    res.status(400).json({ message: "Internal Server Error" });
}

})
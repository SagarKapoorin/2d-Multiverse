import { Router } from "express";
import mongoose from "mongoose";
export const userRouter=Router();
import { UpdateMetadataSchema } from "../../validation";
import User from "@repo/db/user";
import { userMiddleware } from "../../middlewares/user";
userRouter.post("/metadata",userMiddleware,async(req,res)=>{
    // console.log(req);
    const parsedData = UpdateMetadataSchema.safeParse(req.body)       
    if (!parsedData.success) {
        console.log("parsed data incorrect")
        res.status(400).json({message: "Validation failed"})
        return
    }
    try {
        console.log(parsedData.data.avatarId);
        const user=await User.findOneAndUpdate(
            { id: req.userId },
            { avatar : parsedData.data.avatarId},
            { new: true } 
        )
        console.log(user);
        if(!user){
            res.status(400).json({message: "User not found"})
            return;
        }
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
    console.log(objectIds)
    const metadata = await User.find(
        { id: { $in: objectIds } },
        { id: 1, avatar: 1 } 
    )
    .populate('avatar', 'imageUrl');
    console.log(metadata);
    res.json({
        avatars: metadata.map(m => ({
            userId: m.id,
            avatarId: m.avatar
        }))
    })
}catch(err){
    res.status(400).json({ message: "Internal Server Error" });
}

})
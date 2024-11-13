import { Router } from "express";
export const userRouter=Router();
import { UpdateMetadataSchema } from "../../validation";
import User from "@repo/db/user";
userRouter.post("/metadata",async(req,res)=>{
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
userRouter.get("/metadata/bulk",(req,res)=>{

})
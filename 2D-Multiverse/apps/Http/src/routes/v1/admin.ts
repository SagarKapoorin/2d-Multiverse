import { Router } from "express";
import { adminMiddleware } from "../../middlewares/admin";
import { CreateAvatarSchema, CreateElementSchema, CreateMapSchema, UpdateElementSchema } from "../../validation";
export const adminRouter=Router();
import Element from "@repo/db/elements";
import Avatar from "@repo/db/avatar";
import Map from "@repo/db/map";
import MapElements from "@repo/db/mapElements";
adminRouter.use(adminMiddleware);

adminRouter.post("/element",async(req,res)=>{
    const parsedData = CreateElementSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({message: "Validation failed"})
        return
    }
    console.log(parsedData);
    const element =  new Element({
            width: parsedData.data.width,
            height: parsedData.data.height,
            static: parsedData.data.static,
            imageUrl: parsedData.data.imageUrl
    })
    console.log(element);
    await element.save();
    res.json({
        id: element._id
    })
})
adminRouter.put("/element/:elementId",async(req,res)=>{
    const parsedData = UpdateElementSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({message: "Validation failed"})
        return
    }
   const p= await Element.findByIdAndUpdate(
        req.params.elementId,
        { imageUrl: parsedData.data.imageUrl },
        { new: true }
    )

    res.json({message: "Element updated"})
})
adminRouter.post("/avatar",async(req,res)=>{
    const parsedData = CreateAvatarSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({message: "Validation failed"})
        return
    }
    const avatar = new Avatar({
            name: parsedData.data.name,
            imageUrl: parsedData.data.imageUrl
    })
    try {
        await avatar.save();
        console.log(avatar);
        res.json({ avatarId: avatar._id });
    } catch (error) {
        console.error("Error saving avatar:", error);
        res.status(500).json({ message: "Internal server error" });
    }
    
})
adminRouter.post("/map",async(req,res)=>{

    const parsedData = CreateMapSchema.safeParse(req.body);
    if (!parsedData.success) {
        console.log("no")
        res.status(400).json({ message: "Validation failed" });
        return;
    }
    console.log("yes");

    const mapElements = await Promise.all(
        parsedData.data.defaultElements.map(async (e: { element: string; x: number; y: number }) => {
            const mapElement = new MapElements({
                element: e.element,
                x: e.x,
                y: e.y
            });
            await mapElement.save(); 
            return mapElement._id;
        })
    );
    const map = new Map({
        name: parsedData.data.name,
        width: parseInt(parsedData.data.dimensions.split("x")[0]),
        height: parseInt(parsedData.data.dimensions.split("x")[1]),
        thumbnail: parsedData.data.thumbnail,
        mapElements: mapElements,
    });
    console.log(map)
    console.log(mapElements);
    await map.save();
    
    res.json({
        id: map._id
    });
    
})
import { Router } from "express";
import { userMiddleware } from "../../middlewares/user";
import { CreateSpaceSchema, DeleteElementSchema } from "../../validation";
import Space from "@repo/db/space";
import Map from "@repo/db/map";
import SpaceElements from "@repo/db/spaceElements";
import { ISpace } from "@repo/db/space";
export const spaceRouter = Router();
import MapElements, { IMapElements } from "@repo/db/mapElements";
spaceRouter.post("/",userMiddleware,  async (req, res) => {
    const parsedData = CreateSpaceSchema.safeParse(req.body)
    if (!parsedData.success) {
        console.log(JSON.stringify(parsedData))
        res.status(400).json({message: "Validation failed"})
        return
    }
    if (!parsedData.data.mapId) { //blank space creation
        const space = new Space({
            name: parsedData.data.name,
            width: parseInt(parsedData.data.dimensions.split("x")[0]), //100x200
            height: parseInt(parsedData.data.dimensions.split("x")[1]),
            creatorId: req.userId!
        });
        res.json({spaceId: space.id})
        return;
    }
    //already created space creation
    console.log(parsedData);
    const map = await Map.findOne(
        { _id: parsedData.data.mapId },
        { width: 1, height: 1, mapElements: 1 }
    ).populate<{ mapElements: IMapElements[] }>('mapElements').exec();
    
    if (!map) {
        res.status(400).json({ message: "Map not found" });
        return;
    }
    
    const space = new Space({
        name: parsedData.data.name,
        width: map.width,
        height: map.height,
        creator: req.userId!,
    });
    await space.save();
    
    const spaceElementsData = map.mapElements?.map((e) => ({
        space: space._id,
        element: e.element?._id,
        x: e.x,
        y: e.y
    }));
    
    if (spaceElementsData && spaceElementsData.length > 0) {
        await SpaceElements.insertMany(spaceElementsData);
    }
    console.log(spaceElementsData);
    res.json({
        message: "Space and elements created successfully",
        spaceId: space._id
    });
    
})


spaceRouter.delete("/element",  async (req, res) => {
    const parsedData = DeleteElementSchema.safeParse(req.body);
    
    if (!parsedData.success) {
        res.status(400).json({ message: "Validation failed" });
        return;
    }
    const spaceElement = await SpaceElements.findOne({
        _id: parsedData.data.id
    }).populate<{ space : ISpace}>('space').exec();  
    
    console.log(spaceElement?.space);
    console.log("spaceElement?.space");
    
    if (!spaceElement?.space || !spaceElement.space.creator ) {
        res.status(403).json({ message: "Unauthorized" });
        return;
    }
    
    await SpaceElements.deleteOne({
        _id: parsedData.data.id
    });
    
    res.json({ message: "Element deleted" });
    
})

spaceRouter.get("/all", async (req, res) => {

    
})

spaceRouter.post("/element", async (req, res) => {
    res.json({message: "Element added"})
})

spaceRouter.delete("/:spaceId",async (req, res) => {

})

spaceRouter.get("/:spaceId",async (req, res) => {

})
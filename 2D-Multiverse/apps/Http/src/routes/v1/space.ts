import { Router } from "express";
export const spaceRouter = Router();

spaceRouter.post("/",  async (req, res) => {
    
})


spaceRouter.delete("/element",  async (req, res) => {
   
    res.json({message: "Space deleted"})
})

spaceRouter.get("/all", async (req, res) => {

    
})

spaceRouter.post("/element", async (req, res) => {
    res.json({message: "Element added"})
})

spaceRouter.get("/:spaceId",async (req, res) => {

})
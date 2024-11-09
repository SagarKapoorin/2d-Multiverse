import { Router } from "express";
export const router=Router();

router.get("/sign",(req,res)=>{
    res.send("DONE");
})


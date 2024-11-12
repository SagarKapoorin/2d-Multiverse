import { Router } from "express";
import { userRouter } from "./user";
import { adminRouter } from "./admin";
import { spaceRouter } from "./space";
export const router=Router();

router.get("/signup",(req,res)=>{
    res.json({
        message:'Signup'
    })
})
router.get("/signin",(req,res)=>{
    res.json({
        message:'Signin'
    })
})
router.get("/avatars",(req,res)=>{

})
router.get("/elements",(req,res)=>{
   
})
router.use("/user",userRouter);
router.use("/space",spaceRouter);
router.use("/admin",adminRouter);
// router.use("/user",userRouter);


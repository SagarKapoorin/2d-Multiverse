import { Router } from "express";
import { userRouter } from "./user";
import { adminRouter } from "./admin";
import { spaceRouter } from "./space";
import { SigninSchema, SignupSchema } from "../../validation";
import { clearHash } from "../../middlewares/cache";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "@repo/db/user";
import {IAvatar} from "@repo/db/avatar";
import Avatar from "@repo/db/avatar";
import Element from "@repo/db/elements";
import passport from "passport";
import Map from "@repo/db/map";
export const router = Router();

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect:"http://localhost:5173/home",

  })
);

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get("/auth/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send("Error logging out");
    }
    res.redirect("/");
  });
});

router.post("/signup", async (req, res) => {
  clearHash("User");
  const parseData = SignupSchema.safeParse(req.body);
  if (!parseData.success) {
    console.log("parsed data incorrect");
    res.status(400).json({ message: "Validation failed" });
    return;
  }
  const { username, password } = parseData.data;
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);
  try {
    const newUser = new User({
      username,
      password: passwordHash,
      role: parseData.data.type === "admin" ? "Admin" : "User",
    });
    const savedUser = await newUser.save();
    console.log(savedUser);
    res.status(200).json({
      message: "Signup",
      userId: savedUser.id,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});
router.post("/signin", async (req, res) => {
  const parsedData = SigninSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(403).json({ message: "Validation failed" });
    return;
  }
  try {
    const user = await User.findOne({
      username: parsedData.data.username,
    }).populate<{ avatar: IAvatar }>("avatar")
    if (!user) {
      res.status(403).json({ message: "User not found" });
      return;
    }
    const isValid = await bcrypt.compare(
      parsedData.data.password,
      user.password
    );
    if (!isValid) {
      res.status(403).json({ message: "Invalid password" });
      return;
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }
    console.log(user);
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      secret
    );
    if (req.session){req.session.token = token;console.log(req.session.token);}
    console.log("-------")
    console.log(user.avatar.imageUrl);
    res.json({ name:user.username,token, avatarId: user.avatar?.imageUrl ?? 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
      spaces:user.spaces,role:user.role });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Internal server error" });
  }
});
router.get("/avatars", async (req, res) => {
  try {
    const avatars = await Avatar.find({}).cache({
      key: "Avatar",
    });
    res.json({
      avatars: avatars.map((x) => ({
        id: x.id,
        imageUrl: x.imageUrl,
        name: x.name,
      })),
    });
  } catch (err) {
    res.status(400).json({ message: "Internal Server Error" });
  }
});
router.get("/elements", async (req, res) => {
  try {
    const elements = await Element.find({}).cache({
      key: "Element",
    });

    res.json({
      elements: elements.map((e) => ({
        id: e.id,
        imageUrl: e.imageUrl,
        width: e.width,
        height: e.height,
        static: e.static,
      })),
    });
  } catch (err) {
    res.status(400).json({ message: "Internal Server Error" });
  }
});
router.get("/maps",async(req,res)=>{
  try {
    const elements = await Map.find({}).cache({
      key: "Map",
    });
    res.json({
      elements
    });
  } catch (err) {
    res.status(400).json({ message: "Internal Server Error" });
  }
})
router.use("/user", userRouter);
router.use("/space", spaceRouter);
router.use("/admin", adminRouter);
router.use("/user", userRouter);

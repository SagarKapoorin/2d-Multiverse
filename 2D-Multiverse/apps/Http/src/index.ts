import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";
import User from "@repo/db/user";
import { IAvatar } from "@repo/db/avatar";
import dotenv from "dotenv";
import helmet from "helmet";
import { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import passport from "passport";
import { router } from "./routes/v1/Index";
import cookieSession from "cookie-session";
require("./middlewares/passport");
import space from "@repo/db/space";
import rateLimit from "express-rate-limit";
import { mongoRateLimit } from "./middlewares/rateLimit";
dotenv.config({ path: "../../.env" });
const cookieKey: string = process.env.cookieKey || "empty";
// mongo,express:60sec->100limit
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

const app = express();
app.use(
  cookieSession({
    name: "session",
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [cookieKey],
  })
);
app.use(passport.initialize());

app.use(express.json());

app.use(passport.session());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(mongoRateLimit);
app.use(limiter);

const PORT: string = process.env.PORT || "3000";
// console.log(PORT);
const MONGO_URL: string =
  process.env.MONGO_URL ||
  "mongodb://localhost:27017/mydatabase"; /*for docker based port*/
// console.log(MONGO_URL);
mongoose
  .connect(MONGO_URL, {})
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((error) =>
    console.log(`${error} did not 
    connect`)
  );
app.get("/set-cookie", (req, res) => {
  if (req.session) req.session.user = { id: "123", name: "John Doe" };
  console.log(req.session);
  res.send("Cookie has been set!");
});
app.use("/api/v1", router);
app.get("/login/passed", async (req, res) => {
  // console.log("yessss");
  
  if (req.session) {
    const user= await User.findOne({
      id: req.session.passport.user.id,
    }).populate<{ avatar: IAvatar }>("avatar")
    if (!user) {
      res.status(403).json({ message: "User not found" });
      return;
    }
    res.json({
      name: req.session.passport.user.username,
      token: req.session.token,
      avatarId:user.avatar?.imageUrl ?? 
        "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
      spaces: req.session.passport.user.spaces,
      role: req.session.passport.user.role,
    });
  } else {
    res.status(400).json({ message: "Internal server error" });
  }
});
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

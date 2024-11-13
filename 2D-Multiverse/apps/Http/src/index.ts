import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet  from "helmet";
import morgan from "morgan";
import { router } from "./routes/v1/Index";
import  space  from "@repo/db/space";
dotenv.config({ path: '../../.env' }); 

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
const PORT:string = process.env.PORT || '3000';
// console.log(PORT);
const MONGO_URL:string=process.env.MONGO_URL||"mongodb://localhost:27017/mydatabase"/*for docker based port*/; 
// console.log(MONGO_URL);
mongoose
  .connect(MONGO_URL, {
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));
app.use("/api/v1",router);

import mongoose, { Document } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
//60sec->100requests
interface IRateLimit extends Document {
  ip: string;
  requests: number;
  lastRequest: Date;
}
const RateLimitSchema=new mongoose.Schema<IRateLimit>({
  ip: { type: String, required: true },
  requests: { type: Number, required: true },
  lastRequest: { type: Date, required: true },
});
const RateLimit=mongoose.model<IRateLimit>('RateLimit', RateLimitSchema);
export const mongoRateLimit=async (req: Request, res: Response, next: NextFunction) => {
  const ip=req.ip;
  const now=new Date();
  console.log("Rate-Limiting-Wokring");
  console.log(ip);
  let record = await RateLimit.findOne({ ip });
console.log(record);
  if (!record) {
    record = new RateLimit({ ip, requests: 1, lastRequest: now });
  } else {
    const timeDiff=(now.getTime()-record.lastRequest.getTime())/ 1000;
    console.log(timeDiff);
    if (timeDiff<60) {
      if (record.requests>=100) {
         res.status(429).send('Too many requests from this IP, please try again later.');
         return;
      }else{
        record.requests++;
      }
    } else {
      record.requests=1; 
    }
  }
  record.lastRequest = now;
  await record.save();
  next();
};

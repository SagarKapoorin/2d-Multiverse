import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Request } from 'express';
import { GoogleCallbackParameters } from 'passport-google-oauth20';
import { VerifyCallback } from 'passport-google-oauth20';
import { clearHash } from './cache';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(__dirname, '../../../../.env');
dotenv.config({ path: envPath });
import User, { IUser } from '@repo/db/user';
// console.log("working")
passport.serializeUser((user,done) => {
    // console.log("yes4");
  done(null, user);
});

passport.deserializeUser(async (id: string, done: (err: any, user?: Document | null) => void) => {
  try {
    // console.log("yes5");
    const user = await User.findById(id).cache({key:"User"});
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

const clientID:string=process.env.googleClientID || "no-value";
const clientSecret:string=process.env.googleClientSecret || "no-value";
// console.log(clientSecret);
passport.use(
  new GoogleStrategy(
    {
      callbackURL: 'http://localhost:3000/api/v1/auth/google/callback',
      clientID: clientID,
      clientSecret: clientSecret,
      proxy: true,
      passReqToCallback:true,
    },
    async ( req: Request, accessToken: string, refreshToken: string, params: GoogleCallbackParameters, profile: Profile, done: VerifyCallback)    => {
      try {
        // console.log("yes")
        const existingUser = await User.findOne({ id: profile.id }).cache({key:"User"});
        const secret=process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET is not defined in environment variables");
        }
        if (existingUser) {
            const token = jwt.sign({
                userId: existingUser.id,
                role: existingUser.role}, secret);

                if(req.session)req.session.token=token;
                
                req.userId=existingUser.id;
          return done(null, existingUser);
        }
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(profile.id, salt);
        clearHash("User");
        const user=new User({
            id:profile.id,
            username:profile.displayName,
            password:passwordHash,
        })
       
        // console.log(user)
        console.log("created");
        await user.save();
       
        done(null, user);
      } catch (err) {
        done(err, undefined);
      }
    }
  )
);

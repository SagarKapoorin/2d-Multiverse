import { Response } from "express";
import { Query } from "mongoose";
import { Error } from "mongoose";
import mongoose from "mongoose";
const exec = mongoose.Query.prototype.exec;
import { createClient } from "redis";
//errors->getting errors as we are trying to update mongoose.exec function
// modify redis url according
const redisUrl = process.env.redisUrl || "redis://127.0.0.1:6379";
const client = createClient({
  url: redisUrl,
});

client.on("error", (err: Error) => console.error("Redis Client Error", err));

async function connectRedis() {
  try {
    await client.connect();
    console.log("Connected to Redis");
  } catch (err) {
    console.error("Could not connect to Redis", err);
  }
}

connectRedis();

declare module "mongoose" {
  interface DocumentQuery<
    T,
    DocType extends import("mongoose").Document,
    QueryHelpers = {},
  > {
    mongooseCollection: {
      name: any;
    };
    cache(options: { key?: string }): this;
    useCache: boolean;
    hashKey: string;
  }

  interface Query<
    ResultType,
    DocType,
    THelpers = {},
    RawDocType = unknown,
    QueryOp = "find",
    TInstanceMethods = Record<string, never>,
  > extends DocumentQuery<any, any> {}
}

mongoose.Query.prototype.exec = async function () {
  if (!this.useCache) {
    return exec.apply(this, arguments as unknown as []);
  }
  console.log("-------");
  console.log(this.getQuery());
  console.log(this.mongooseCollection.name);
console.log("-------");
  const result = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name,
    })
  );
  console.log(result);
  const cached = await client.hGet(this.hashKey, result);

  if (cached) {
    // console.log(cached);
    console.log("SERVING FROM Cache");
    const doc = JSON.parse(cached);
    console.log(doc);
    return Array.isArray(doc)
      ? doc.map((d) => new this.model(d))
      : new this.model(doc);
  } else {
    console.log("SERVING FROM MongoDB");
    const output = await exec.apply(this, arguments as unknown as []);
    await client.hSet(this.hashKey, result, JSON.stringify(output));
    await client.expire(this.hashKey, 86400 * 5); //5 days
    return output;
  }
};

mongoose.Query.prototype.cache = function (
  this: Query<any, any>,
  options: { key?: string } = {}
): Query<any, any> {
  if (options.key) {
    this.useCache = true;
    const key = options.key;
    this.hashKey = key;
  }
  return this; // Return `this` to allow chainable methods
};

export const clearHash = async (hashKey: string): Promise<void> => {
  try {
    await client.del(hashKey);
    console.log(`Cleared hash for key: ${hashKey}`);
  } catch (error) {
    console.error(`Error clearing hash for key ${hashKey}:`, error);
  }
};

import { Router } from "express";
import { userMiddleware } from "../../middlewares/user";
import {
  AddElementSchema,
  CreateSpaceSchema,
  DeleteElementSchema,
} from "../../validation";
import Space from "@repo/db/space";
import Map from "@repo/db/map";
import SpaceElements from "@repo/db/spaceElements";
import { ISpaceElements } from "@repo/db/spaceElements";
import { IElement } from "@repo/db/elements";
import { ISpace } from "@repo/db/space";
import mongoose from "mongoose";
export const spaceRouter = Router();
import User from "@repo/db/user";
import { IAvatar } from "@repo/db/avatar";
import jwt from "jsonwebtoken";
import MapElements, { IMapElements } from "@repo/db/mapElements";
import { clearHash } from "../../middlewares/cache";
spaceRouter.use(userMiddleware);

spaceRouter.get('/google/user', async(req, res) => {
  if (req.isAuthenticated()) {

    const user= await User.findOne({
      id: req.userId,
    }).populate<{ avatar: IAvatar }>("avatar")
    if (!user) {
      res.status(403).json({ message: "User not found" });
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
      res.json({ name:user.username,token, avatarId: user.avatar?.imageUrl ?? 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
      spaces:user.spaces,role:user.role }); 
  } else {
      res.status(401).json({ error: 'Not authenticated' });
  }
});

spaceRouter.post("/", async (req, res) => {
  try {
    const parsedData = CreateSpaceSchema.safeParse(req.body);
    if (!parsedData.success) {
      console.log(JSON.stringify(parsedData));
      res.status(400).json({ message: "Validation failed" });
      return;
    }
    console.log(req.userId);
    console.log(parsedData);
    clearHash("Space");
    if (!parsedData.data.mapId) {
      //blank space creation
      const space = new Space({
        name: parsedData.data.name,
        width: parseInt(parsedData.data.dimensions.split("x")[0]), //100x200
        height: parseInt(parsedData.data.dimensions.split("x")[1]),
        creator: req.userId!,
      });
      await space.save();

      res.json({ spaceId: space.id });
      return;
    }
    //already created space creation
    console.log(parsedData);
    const map = await Map.findOne(
      { _id: parsedData.data.mapId },
      { width: 1, height: 1, mapElements: 1,thumbnail:1 }
    ).populate<{ mapElements: IMapElements[] }>("mapElements").cache({
        key: "Map",
      })
      .exec();

    if (!map) {
      res.status(400).json({ message: "Map not found" });
      return;
    }
    clearHash("Space");
    const space = new Space({
      name: parsedData.data.name,
      width: map.width,
      height: map.height,
      creator: req.userId!,
      thumbnail:map.thumbnail
    });
    console.log("-----")
    console.log(space);
    console.log(map)
    await space.save();

    const spaceElementsData = map.mapElements?.map((e) => ({
      space: space._id,
      element: e.element?._id,
      x: e.x,
      y: e.y,
    }));
    clearHash("SpaceElements");
    if (spaceElementsData && spaceElementsData.length > 0) {
      const insertedSpaceElements =
        await SpaceElements.insertMany(spaceElementsData);
      const spaceElementIds = insertedSpaceElements.map((e) => e._id);
      console.log(spaceElementIds);
      const newSpace = await Space.findByIdAndUpdate(
        { _id: space._id },
        {
          $push: { elements: { $each: spaceElementIds } },
        },
        { new: true }
      );

      console.log(newSpace);
    }

    res.json({
      message: "Space and elements created successfully",
      spaceId: space._id,
    });
  } catch (err) {
    res.status(400).json({ message: "Internal Server Error" });
  }
});

spaceRouter.delete("/element", async (req, res) => {
  try {
    const parsedData = DeleteElementSchema.safeParse(req.body);

    if (!parsedData.success) {
      res.status(400).json({ message: "Validation failed" });
      return;
    }
    const spaceElement = await SpaceElements.findOne({
      _id: parsedData.data.id,
    })
      .cache({
        key: "SpaceElements",
      })
      .populate<{ space: ISpace }>("space")
      .exec();

    console.log(spaceElement?.space);
    // console.log("spaceElement?.space");

    if (!spaceElement?.space || !spaceElement.space.creator) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }
    clearHash("SpaceElements");
    await SpaceElements.deleteOne({
      _id: parsedData.data.id,
    });

    res.json({ message: "Element deleted" });
  } catch (err) {
    res.status(400).json({ message: "Internal Server Error" });
  }
});

spaceRouter.get("/all", async (req, res) => {
  console.log("/all---");
  console.log(req.userId);
  try {
    const spaces = await Space.find({
      creator: req.userId!,
    }).cache({
      key: "Space",
    });
    console.log(spaces);
    res.json({
      spaces: spaces.map((s) => ({
        id: s.id,
        name: s.name,
        thumbnail: s.thumbnail,
        dimensions: `${s.width}x${s.height}`,
      })),
    });
  } catch (err) {
    res.status(400).json({ message: "Internal Server Error" });
  }
});
spaceRouter.get("/every", async (req, res) => {
  try {
    const spaces = await Space.find({
    }).cache({
      key: "Space",
    });
    res.json({
      spaces: spaces.map((s) => ({
        id: s.id,
        name: s.name,
        thumbnail: s.thumbnail,
        dimensions: `${s.width}x${s.height}`,
      })),
    });
  } catch (err) {
    res.status(400).json({ message: "Internal Server Error" });
  }
});
function isValidObjectId(param: string | mongoose.Types.ObjectId): boolean {
  return mongoose.Types.ObjectId.isValid(param);
}
spaceRouter.post("/element", async (req, res) => {
  try {
    const parsedData = AddElementSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json({ message: "Validation failed" });
      return;
    }

    //    console.log("1");
    const space = await Space.findOne({
      _id: req.body.spaceId,
      creator: req.userId!,
    })
      .cache({
        key: "Space",
      })
      .select("width height");

    if (
      req.body.x < 0 ||
      req.body.y < 0 ||
      req.body.x > space?.width! ||
      req.body.y > space?.height!
    ) {
      // console.log("three");
      res.status(400).json({ message: "Point is outside of the boundary" });
      return;
    }

    if (!space) {
      // console.log("4");
      res.status(400).json({ message: "Space not found" });
      return;
    }
    // console.log(space);
    clearHash("SpaceElements");
    const newSpaceElements = new SpaceElements({
      space: req.body.spaceId,
      element: req.body.elementId,
      x: req.body.x,
      y: req.body.y,
    });
    clearHash("Space");
    const updatedSpace = await Space.findByIdAndUpdate(
      { _id: req.body.spaceId },
      {
        $push: { elements: newSpaceElements._id },
      },
      { new: true }
    );
    console.log(updatedSpace);
    await newSpaceElements.save();

    res.json({ message: "Element added" });
  } catch (err) {
    res.status(400).json({ message: "Internal Server Error" });
  }
});

spaceRouter.delete("/:spaceId", async (req, res) => {
  try {
    if (!isValidObjectId(req.params.spaceId)) {
      res.status(400).json({ message: "Space not found" });
      return;
    }
    // console.log(req.params.spaceId);

    const space = await Space.findOne({
      _id: req.params.spaceId,
    })
      .cache({
        key: "Space",
      })
      .select("creator");
    console.log(space);
    // console.log(req.userId);
    if (!space) {
      res.status(400).json({ message: "Space not found" });
      return;
    }
    if (space.creator.toString() !== req.userId) {
      console.log("code should reach here");
      res.status(403).json({ message: "Unauthorized" });
      return;
    }
    clearHash("Space");
    await Space.findByIdAndDelete({
      _id: req.params.spaceId,
    });
    res.json({ message: "Space deleted" });
  } catch (err) {
    res.status(400).json({ message: "Internal Server Error" });
  }
});

spaceRouter.get("/:spaceId", async (req, res) => {
  if (!isValidObjectId(req.params.spaceId)) {
    res.status(400).json({ message: "Space not found" });
    return;
  }
  const space = await Space.findById(req.params.spaceId).populate<{
    elements: (ISpaceElements & { element: IElement })[];
  }>({
    path: "elements",
    populate: {
      path: "element",
      model: "Element",
      select: "id imageUrl width height static",
    },
  });
  console.log(space);
  if (!space) {
    res.status(400).json({ message: "Space not found" });
    return;
  }
  console.log(space.width);
  res.json({
    imageUrl:`${space.thumbnail}`,
    dimensions: `${space.width}x${space.height}`,
    elements: space.elements.map((e) => ({
      id: e.id,
      element: {
        id: e.element.id,
        imageUrl: e.element.imageUrl,
        width: e.element.width,
        height: e.element.height,
        static: e.element.static,
      },
      x: e.x,
      y: e.y,
    })),
  });
});

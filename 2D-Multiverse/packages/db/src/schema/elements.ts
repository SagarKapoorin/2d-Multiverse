import mongoose, { Document, Schema } from 'mongoose';

interface IElement extends Document {
  width: number;
  height: number;
  imageUrl: string;
  static: boolean;
  spaces: mongoose.Types.ObjectId[];
  mapElements: mongoose.Types.ObjectId[];
}

const ElementSchema: Schema<IElement> = new Schema({
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  static: { type: Boolean, required: true },
  spaces: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SpaceElements' }],
  mapElements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MapElements' }]
});

const Element = mongoose.model<IElement>('Element', ElementSchema);

export default Element;

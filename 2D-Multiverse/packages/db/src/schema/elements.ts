import mongoose, { Document, Schema , Types} from 'mongoose';

export interface IElement extends Document {
  width: number;
  height: number;
  imageUrl: string;
  static: boolean;
  spaces: Types.ObjectId[];
  mapElements: Types.ObjectId[];
}

const ElementSchema: Schema<IElement> = new Schema({
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  static: { type: Boolean, required: true },
  spaces: [{ type: Schema.Types.ObjectId, ref: 'SpaceElements' }],
  mapElements: [{ type: Schema.Types.ObjectId, ref: 'MapElements' }]
});

const Element = mongoose.model<IElement>('Element', ElementSchema);

export default Element;

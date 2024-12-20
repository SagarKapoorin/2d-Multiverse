import mongoose, { Document, Schema,Types } from 'mongoose';

export interface ISpaceElements extends Document {
  element: Types.ObjectId;
  space:Types.ObjectId;
  x: number;
  y: number;
}

const SpaceElementsSchema: Schema<ISpaceElements> = new Schema({
  element: { type: Schema.Types.ObjectId, ref: 'Element', required: true },
  space: { type: Schema.Types.ObjectId, ref: 'Space', required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true }
});

const SpaceElements = mongoose.model<ISpaceElements>('SpaceElements', SpaceElementsSchema);

export default SpaceElements;

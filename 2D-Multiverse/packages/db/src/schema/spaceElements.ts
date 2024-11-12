import mongoose, { Document, Schema } from 'mongoose';

interface ISpaceElements extends Document {
  element: mongoose.Types.ObjectId;
  space: mongoose.Types.ObjectId;
  x: number;
  y: number;
}

const SpaceElementsSchema: Schema<ISpaceElements> = new Schema({
  id: { type: String, default: () => new mongoose.Types.ObjectId() },
  element: { type: Schema.Types.ObjectId, ref: 'Element', required: true },
  space: { type: Schema.Types.ObjectId, ref: 'Space', required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true }
});

const SpaceElements = mongoose.model<ISpaceElements>('SpaceElements', SpaceElementsSchema);

export default SpaceElements;

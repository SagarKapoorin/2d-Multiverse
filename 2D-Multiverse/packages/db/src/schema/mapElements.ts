import mongoose, { Document, Schema } from 'mongoose';

interface IMapElements extends Document {
  map: mongoose.Types.ObjectId;
  element: mongoose.Types.ObjectId;
  x?: number | null;
  y?: number | null;
}

const MapElementsSchema: Schema<IMapElements> = new Schema({
  map: { type: Schema.Types.ObjectId, ref: 'Map', required: true },
  element: { type: Schema.Types.ObjectId, ref: 'Element', required: true },
  x: { type: Number, default: null },
  y: { type: Number, default: null }
});

const MapElements = mongoose.model<IMapElements>('MapElements', MapElementsSchema);

export default MapElements;

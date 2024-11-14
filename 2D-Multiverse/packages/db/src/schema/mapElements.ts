import mongoose, { Document, Schema ,Types} from 'mongoose';

export interface IMapElements extends Document {
  map: Types.ObjectId;
  element: Types.ObjectId;
  x: number;
  y: number;
}

const MapElementsSchema: Schema<IMapElements> = new Schema({
  map: { type: Schema.Types.ObjectId, ref: 'Map' },
  element: { type: Schema.Types.ObjectId, ref: 'Element', required: true },
  x: { type: Number, required:true },
  y: { type: Number, required:true }
});

const MapElements = mongoose.model<IMapElements>('MapElements', MapElementsSchema);

export default MapElements;

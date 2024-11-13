import mongoose, { Document, Schema } from 'mongoose';

interface IMap extends Document {
  width: number;
  height: number;
  name: string;
  thumbnail?: string;
  mapElements: mongoose.Types.ObjectId[];
}

const MapSchema: Schema<IMap> = new Schema({
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  name: { type: String, required: true },
  thumbnail: { type: String },
  mapElements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MapElements' }]
});

const Map = mongoose.model<IMap>('Map', MapSchema);

export default Map;

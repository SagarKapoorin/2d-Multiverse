import mongoose , {Document,Schema,Types} from "mongoose";
export interface ISpace extends Document {
  name: string;
  width: number;
  height: number | null;
  thumbnail: string | null;
  creator: Types.ObjectId; 
  elements: Types.ObjectId[]; 
}
const SpaceSchema:Schema<ISpace> = new Schema({
    name: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, default: null },
    thumbnail: { type: String, default: null },
    creator: { type: Schema.Types.ObjectId, ref:'User', required:true},
    elements: [{ type: Schema.Types.ObjectId, ref: 'SpaceElements' }],
  });
  
  const Space = mongoose.model<ISpace>('Space', SpaceSchema);
  export default Space;
  
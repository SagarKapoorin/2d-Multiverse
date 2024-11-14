import mongoose, { Document, Schema ,Types} from 'mongoose';
interface IAvatar extends Document {
  imageUrl: string | null;
  name: string | null;
  users: Types.ObjectId[];
}
const AvatarSchema: Schema<IAvatar> = new Schema({
  imageUrl: { type: String, default: null },
  name: { type: String, default: null },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});
const Avatar = mongoose.model<IAvatar>('Avatar', AvatarSchema);
export default Avatar;

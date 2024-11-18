import mongoose, { Document, Schema ,Types} from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
  avatar: Types.ObjectId ;
  role: 'Admin' | 'User';
  spaces: Types.ObjectId[];
}

const UserSchema: Schema<IUser> = new Schema({
  id: { type: String, default: () => new mongoose.Types.ObjectId() },
  username: { type: String, unique: true, required: true },
  password: { type: String, unique: true, required: true },
  avatar: { type: Schema.Types.ObjectId, ref: 'Avatar' },
  role: { type: String, enum: ['Admin', 'User'], required: true , default:'User'},
  spaces: [{ type: Schema.Types.ObjectId, ref: 'Space' }]
});
UserSchema.index({id:1});
UserSchema.index({username:1});
const User = mongoose.model<IUser>('User', UserSchema);

export default User;

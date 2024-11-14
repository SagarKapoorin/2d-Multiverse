import mongoose, { Document, Schema ,Types} from 'mongoose';

interface IUser extends Document {
  username: string;
  password: string;
  avatar: Types.ObjectId | null;
  role: 'Admin' | 'User';
  spaces: Types.ObjectId[];
}

const UserSchema: Schema<IUser> = new Schema({
  id: { type: String, default: () => new mongoose.Types.ObjectId() },
  username: { type: String, unique: true, required: true },
  password: { type: String, unique: true, required: true },
  avatar: { type: Schema.Types.ObjectId, ref: 'Avatar' },
  role: { type: String, enum: ['Admin', 'User'], required: true },
  spaces: [{ type: Schema.Types.ObjectId, ref: 'Space' }]
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;

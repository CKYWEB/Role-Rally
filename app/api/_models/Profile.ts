import mongoose, { Types } from "mongoose";

interface Phone {
  number: string; // xxxx
  type: string; // 001
}

export interface IProfile {
  _id: string;
  ownerRoleId: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone: Phone;
  avatar: string;
  about: string;
  pronouns: string;
  username: string;
  website: string;
}

const PhoneSchema = new mongoose.Schema<Phone>({
  number: { type: String, required: true },
  type: { type: String, required: true },
});

export const ProfileSchema = new mongoose.Schema<IProfile>({
  firstName: { type: String, required: true },
  lastName: String,
  email: { type: String, required: true },
  phone: { type: PhoneSchema },
  ownerRoleId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  avatar: String,
  about: String,
  pronouns: String,
  username: String,
  website: String,
});

export default mongoose.models.Profile ||
  mongoose.model<IProfile>("Profile", ProfileSchema);

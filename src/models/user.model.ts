import mongoose from "mongoose";

const genKey = () => {
  return [...Array(30)]
    .map((_) => ((Math.random() * 36) | 0).toString(36))
    .join("");
};

export interface UserDocument extends mongoose.Document {
  host: string;
  api_key: string;
  is_admin: boolean;
  usage: Usage[];
}

export interface Usage {
  date: string;
  count: number;
}

const userSchema = new mongoose.Schema(
  {
    host: { type: String, required: true },
    is_admin: { type: Boolean, default: false },
    api_key: {
      type: String,
      required: true,
      unique: true,
      default: () => genKey(),
    },
    usage: [
      {
        date: {
          type: String,
        },
        count: {
          type: Number,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;

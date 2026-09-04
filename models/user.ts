import mongoose, { Document, Model, Schema } from "mongoose";

export type UserRole =
  | "student"
  | "author"
  | "libraryAttendant";

export interface IUser extends Document {
  title: string;
  email: string;
  password: string;
  role: UserRole;
  bio?: string;
  staffId?: string;
  borrowedBooks: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: [
        "student",
        "author",
        "libraryAttendant",
      ],
      default: "student",
    },

    bio: {
      type: String,
    },

    staffId: {
      type: String,
      unique: true,
      sparse: true,
    },

    borrowedBooks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> =
  mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);

export default User;
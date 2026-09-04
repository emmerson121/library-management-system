import mongoose, {
  Schema,
  Document,
  Model,
} from "mongoose";

// =====================================================
// AUTHOR INTERFACE
// =====================================================

export interface IAuthor extends Document {
  title: string;
  email: string;
  password: string;

  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

// =====================================================
// AUTHOR SCHEMA
// =====================================================

const AuthorSchema = new Schema<IAuthor>(
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
    },

    resetPasswordToken: {
      type: String,
      default: null,
    },

    resetPasswordExpires: {
      type: Date,
      default: null,
    },
    
  },
  {
    timestamps: true,
  }

  
);

// =====================================================
// DEBUG
// =====================================================

console.log(
  "AUTHOR SCHEMA PATHS:",
  Object.keys(AuthorSchema.paths)
);

// =====================================================
// EXPORT MODEL
// =====================================================

const Author: Model<IAuthor> =
  mongoose.models.Author ||
  mongoose.model<IAuthor>(
    "Author",
    AuthorSchema
  );

export default Author;


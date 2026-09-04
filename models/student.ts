import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

// ======================================================
// Student Interface
// ======================================================

export interface IStudent extends Document {
  title: string;
  email: string;
  password: string;
  studentId: string;

  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;

  createdAt: Date;
  updatedAt: Date;
  borrowedBooks: mongoose.Types.ObjectId[];
}

// ======================================================
// Student Schema
// ======================================================

const StudentSchema = new Schema<IStudent>(
  {
    // Student's name/title
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Student's email
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Hashed password
    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // Automatically generated Student ID
    // Examples: STU001, STU002, STU003
    studentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // Books currently borrowed by the student
    borrowedBooks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Book",
      },
    ],

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

// ======================================================
// Prevent model recompilation during Next.js hot reload
// ======================================================

const Student: Model<IStudent> =
  mongoose.models.Student ||
  mongoose.model<IStudent>("Student", StudentSchema);

export default Student;
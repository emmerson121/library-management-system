import mongoose, { Document, Model, Schema } from "mongoose";


// =====================================================
// LIBRARIAN INTERFACE
// =====================================================

export interface ILibrarian extends Document {
  title: string;
  email: string;
  password: string;

  // Generated automatically
  // Example: LIB001
  staffId?: string;

  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;


  createdAt: Date;
  updatedAt: Date;
}

// =====================================================
// LIBRARIAN SCHEMA
// =====================================================

const LibrarianSchema = new Schema<ILibrarian>(
  {
    // Librarian's name
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Librarian's email
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
    },

    // Automatically generated Staff ID
    //
    // LIB001
    // LIB002
    // LIB003
    staffId: {
      type: String,
      unique: true,
      sparse: true,
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
// AUTOMATIC STAFF ID
// =====================================================

LibrarianSchema.pre("save", async function () {
  // If this is an existing librarian,
  // don't generate another ID.
  if (!this.isNew || this.staffId) {
    return;
  }

  // Get the Librarian model
  const LibrarianModel =
    mongoose.models.Librarian ||
    mongoose.model<ILibrarian>(
      "Librarian",
      LibrarianSchema
    );

  // Find the most recently created librarian
  const lastLibrarian = await LibrarianModel
    .findOne({})
    .sort({ createdAt: -1 });

  let nextNumber = 1;

  if (lastLibrarian?.staffId) {
    // Example:
    // LIB001 → 1
    // LIB002 → 2
    // LIB010 → 10

    const lastNumber = parseInt(
      lastLibrarian.staffId.replace("LIB", ""),
      10
    );

    if (!isNaN(lastNumber)) {
      nextNumber = lastNumber + 1;
    }
  }

  // Generate the Staff ID
  //
  // 1  → LIB001
  // 2  → LIB002
  // 10 → LIB010
  this.staffId = `LIB${String(nextNumber).padStart(3, "0")}`;
});

// =====================================================
// EXPORT MODEL
// =====================================================

const Librarian: Model<ILibrarian> =
  mongoose.models.Librarian ||
  mongoose.model<ILibrarian>(
    "Librarian",
    LibrarianSchema
  );

export default Librarian;
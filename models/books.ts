import mongoose, { Document, Model, Schema } from "mongoose";

export interface IBook extends Document {
  title: string;
  isbn?: string;

  authors: mongoose.Types.ObjectId[];

  genre?: string;
  year?: number;
  cover?: string;
  description?: string;

  status: "IN" | "OUT";

  borrowedBy?: mongoose.Types.ObjectId | null;

  issuedBy?: mongoose.Types.ObjectId | null;

  returnDate?: Date | null;

  reminders?: {
    twoDaysBefore: {
      sent: boolean;
      sentAt?: Date | null;
    };

    oneDayBefore: {
      sent: boolean;
      sentAt?: Date | null;
    };

    dueDate: {
      sent: boolean;
      sentAt?: Date | null;
    };

    overdue: {
      lastSentAt?: Date | null;
    };
  };
}

const BookSchema = new Schema<IBook>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    isbn: {
      type: String,
    },

    authors: [
      {
        type: Schema.Types.ObjectId,
        ref: "Author",
      },
    ],

    genre: {
      type: String,
    },

    year: {
      type: Number,
    },

    cover: {
      type: String,
    },

    description: {
      type: String,
    },

    status: {
      type: String,
      enum: ["IN", "OUT"],
      default: "IN",
    },

    borrowedBy: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      default: null,
    },

    issuedBy: {
      type: Schema.Types.ObjectId,
      ref: "Librarian",
      default: null,
    },

    returnDate: {
      type: Date,
      default: null,
    },

    reminders: {
      twoDaysBefore: {
        sent: {
          type: Boolean,
          default: false,
        },
        sentAt: {
          type: Date,
          default: null,
        },
      },

      oneDayBefore: {
        sent: {
          type: Boolean,
          default: false,
        },
        sentAt: {
          type: Date,
          default: null,
        },
      },

      dueDate: {
        sent: {
          type: Boolean,
          default: false,
        },
        sentAt: {
          type: Date,
          default: null,
        },
      },

      overdue: {
        lastSentAt: {
          type: Date,
          default: null,
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

const BookInfo: Model<IBook> =
  mongoose.models.Book ||
  mongoose.model<IBook>("Book", BookSchema);

export default BookInfo;
import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import BookInfo from "@/models/books";
import "@/models/student";
import { sendReturnReminder } from "@/lib/email";

export async function GET(request: NextRequest) {
  try {
    // Protect the reminder endpoint
    const authHeader = request.headers.get("authorization");

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    await connectToDB();

    const now = new Date();

    // Start and end of today
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    // Start and end of the day 1 day from now
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    const tomorrowEnd = new Date(todayEnd);
    tomorrowEnd.setDate(tomorrowEnd.getDate() + 1);

    // Start and end of the day 2 days from now
    const twoDaysStart = new Date(todayStart);
    twoDaysStart.setDate(twoDaysStart.getDate() + 2);

    const twoDaysEnd = new Date(todayEnd);
    twoDaysEnd.setDate(twoDaysEnd.getDate() + 2);

    // Find all currently borrowed books
    const books = await BookInfo.find({
      status: "OUT",
      returnDate: { $ne: null },
    }).populate("borrowedBy");

    let sentCount = 0;

    for (const book of books) {
      const student = book.borrowedBy as any;

      if (!student || !student.email || !book.returnDate) {
        continue;
      }

      const returnDate = new Date(book.returnDate);

      let reminderType:
        | "twoDaysBefore"
        | "oneDayBefore"
        | "dueDate"
        | "overdue"
        | null = null;

      // ---------------------------------------
      // 2 DAYS BEFORE
      // ---------------------------------------
      if (
        returnDate >= twoDaysStart &&
        returnDate <= twoDaysEnd &&
        !book.reminders?.twoDaysBefore?.sent
      ) {
        reminderType = "twoDaysBefore";
      }

      // ---------------------------------------
      // 1 DAY BEFORE
      // ---------------------------------------
      else if (
        returnDate >= tomorrowStart &&
        returnDate <= tomorrowEnd &&
        !book.reminders?.oneDayBefore?.sent
      ) {
        reminderType = "oneDayBefore";
      }

      // ---------------------------------------
      // DUE DATE
      // ---------------------------------------
      else if (
        returnDate >= todayStart &&
        returnDate <= todayEnd &&
        !book.reminders?.dueDate?.sent
      ) {
        reminderType = "dueDate";
      }

      // ---------------------------------------
      // OVERDUE
      // ---------------------------------------
      else if (returnDate < todayStart) {
        const lastSentAt = book.reminders?.overdue?.lastSentAt;

        const shouldSendOverdue =
          !lastSentAt ||
          new Date(lastSentAt).toDateString() !== now.toDateString();

        if (shouldSendOverdue) {
          reminderType = "overdue";
        }
      }

      // No reminder needed for this book
      if (!reminderType) {
        continue;
      }

      try {
        await sendReturnReminder({
          studentName: student.title || "Student",
          studentEmail: student.email,
          bookTitle: book.title,
          returnDate: returnDate,
          reminderType,
        });

        // ---------------------------------------
        // SAVE REMINDER STATUS
        // ---------------------------------------

        if (reminderType === "twoDaysBefore") {
          book.reminders!.twoDaysBefore.sent = true;
          book.reminders!.twoDaysBefore.sentAt = now;
        }

        if (reminderType === "oneDayBefore") {
          book.reminders!.oneDayBefore.sent = true;
          book.reminders!.oneDayBefore.sentAt = now;
        }

        if (reminderType === "dueDate") {
          book.reminders!.dueDate.sent = true;
          book.reminders!.dueDate.sentAt = now;
        }

        if (reminderType === "overdue") {
          book.reminders!.overdue.lastSentAt = now;
        }

        await book.save();

        sentCount++;
      } catch (emailError) {
        console.error(
          `Failed to send ${reminderType} reminder for book ${book._id}:`,
          emailError
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Reminder check completed",
      remindersSent: sentCount,
    });
  } catch (error) {
    console.error("REMINDER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to process reminders",
      },
      { status: 500 }
    );
  }
}
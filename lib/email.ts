import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

type ReminderType =
  | "twoDaysBefore"
  | "oneDayBefore"
  | "dueDate"
  | "overdue";

interface ReturnReminderProps {
  studentName: string;
  studentEmail: string;
  bookTitle: string;
  returnDate: Date | string;
  reminderType: ReminderType;
}

export async function sendReturnReminder({
  studentName,
  studentEmail,
  bookTitle,
  returnDate,
  reminderType,
}: ReturnReminderProps) {
  const formattedDate = new Date(returnDate).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let subject = "";
  let heading = "";
  let message = "";
  let closingMessage = "";

  switch (reminderType) {
    case "twoDaysBefore":
      subject = `Reminder: "${bookTitle}" is due in 2 days`;
      heading = "Book Return Reminder";
      message = `
        This is a friendly reminder that the book you borrowed
        is due for return in <strong>2 days</strong>.
      `;
      closingMessage = `
        Please make arrangements to return the book on or before the
        due date.
      `;
      break;

    case "oneDayBefore":
      subject = `Reminder: "${bookTitle}" is due tomorrow`;
      heading = "Book Return Reminder";
      message = `
        This is a reminder that the book you borrowed
        is due for return <strong>tomorrow</strong>.
      `;
      closingMessage = `
        Please remember to return the book tomorrow.
      `;
      break;

    case "dueDate":
      subject = `Due Today: Please return "${bookTitle}"`;
      heading = "Book Due Today";
      message = `
        The book you borrowed is <strong>due for return today</strong>.
      `;
      closingMessage = `
        Please return the book today to avoid it becoming overdue.
      `;
      break;

    case "overdue":
      subject = `Overdue: Please return "${bookTitle}"`;
      heading = "Book Return Overdue";
      message = `
        Our records show that the book you borrowed has
        <strong>not yet been returned</strong> and is now overdue.
      `;
      closingMessage = `
        Please return the book as soon as possible.
      `;
      break;
  }

  await transporter.sendMail({
    from: `"Library Management System" <${process.env.GMAIL_USER}>`,
    to: studentEmail,
    subject,

    html: `
      <div
        style="
          font-family: Arial, sans-serif;
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          color: #333;
        "
      >
        <h2>${heading}</h2>

        <p>Hello ${studentName},</p>

        <p>
          ${message}
        </p>

        <div
          style="
            background: #f5f5f5;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
          "
        >
          <p style="margin: 5px 0;">
            <strong>Book:</strong> ${bookTitle}
          </p>

          <p style="margin: 5px 0;">
            <strong>Return Date:</strong> ${formattedDate}
          </p>
        </div>

        <p>
          ${closingMessage}
        </p>

        <p>
          Thank you for helping us keep our library collection
          available to other students.
        </p>

        <p>
          <strong>Library Management System</strong>
        </p>
      </div>
    `,
  });
}
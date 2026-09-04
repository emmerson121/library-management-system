export interface BorrowedBy {
  id: string;
  title: string;
  email: string;
  studentId: string;
}

export interface IssuedBy {
  id: string;
  title: string;
  staffId: string;
}

export interface BookAuthor {
  _id?: string;
  id?: string;
  title?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
}

export interface Book {
  _id?: string;
  id?: string | number;
  title: string;

  author?: string;

  authors?: BookAuthor[];

  year?: number;
  genre?: string;
  cover?: string;
  description?: string;

  status?: "IN" | "OUT";

  available?: boolean;

 borrowedBy?: BorrowedBy | string | null;

  issuedBy?: IssuedBy | string | null;


  returnDate?: string | Date | null;
}
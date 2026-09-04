const BookInfo = require('../../models/books')

exports.returnBook = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'student') {
    return res.status(403).json({ message: "Only students can return books" });
}

        const bookId = req.params.id;
        const book = await BookInfo.findById(bookId);
        
        book.borrowedBy === req.user.id

        // check if book exists
        if (!book)
            return res.status(404).json({ message: 'Book not found' });
        
        // check if book is already returned
        if(book.status === "IN"){
            return res.status(400).json({message: "Book is already returned" });
        }

        // checks  for the student who borrowed the book
        if (book.borrowedBy.toString() !== req.user.id) {
        return res.status(403).json({ message: "You did not borrow this book" });
        }

        // reset fields
        book.status = "IN";
        book.borrowedBy = null;
        book.issuedBy = null;
        book.returnDate = Date();

        await book.save();

        res.status(200).json({ message: 'Book returned successfully', book });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
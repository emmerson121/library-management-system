const BookInfo = require('../models/books')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

// get all books
exports.getAllBooks = async (req, res) => {
    console.log("🔥 getAllBooks CONTROLLER WAS CALLED");

    try {
        // Get query params
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
        const totalBooks = await BookInfo.countDocuments();
        const totalPages = Math.ceil(totalBooks / limit);

        const sortObj = {};
        sortObj[sortBy] = sortOrder

        // Fetch paginated books
           const books = await BookInfo.find()
    .sort(sortObj)
    .skip(skip)
    .limit(limit)
    .populate("authors")
    .populate("borrowedBy")
    .populate("issuedBy");

    console.log("BACKEND POPULATED BOOKS:", JSON.stringify(books, null, 2));

        // const books = await BookInfo.find().sort(sortObj).skip(skip).limit(limit)
            // .skip(skip)
            // .limit(limit)
            // .populate('authors')
            // .populate('borrowedBy')
            // .populate('issuedBy');

        // Total count
        

        // const books = await BookInfo.find()
        //     .populate('authors')
        //     .populate('borrowedBy')
        //     .populate('issuedBy');

        res.status(200).json({
            success: true,
             currentPage: page,
            totalBooks: totalBooks,
            totalPages: totalPages,
            data: books
        });

        // res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// get a single book
exports.getSingleBook = async (req, res) => {
    try {
        const book = await BookInfo.findById(req.params.id)
            .populate('authors')
            .populate('borrowedBy')
            .populate('issuedBy');

        if (!book)
            return res.status(400).json({ message: 'Book not found' });

        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// create book
exports.createBook = async (req, res) => {
    try {
        const { title, isbn, authors, genre, year, cover, desc } = req.body;

         // Check admin role (from logged-in user)
        if (!req.user || req.user.role !== 'libraryAttendant') {
            console.log(req.user);
            
    return res.status(403).json({
        success: false,
        message: "Only library attendant can add books"
    });
}

    if (!title || !isbn) {
    return res.status(400).json({
        success: false,
        message: "Title and ISBN are required"
    });
}

 // check if the book is already existing in our database
        const checkExistingBook = await BookInfo.findOne({$or : [{title}, {isbn}]})
        if(checkExistingBook){
            return res.status(400).json({
                success: false,
                message: 'Book already exists with same title or isbn! Please try again with a different title or isbn'
            });
        }

        const book = new BookInfo({
            title,
            isbn,
            authors,
            genre,
            year,
            cover,
            desc,
        });

        await book.save();

        res.status(201).json({ message: 'Book added successfully', book });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// update a book by ID
exports.updateBook = async (req, res) => {
    console.log("REQ.USER:", req.user);
        console.log("USER ROLE:", req.user?.role);
    try {
        if (!req.user || req.user.role !== 'libraryAttendant') {
    return res.status(403).json({ message: "Access denied" });
}

        const updatedBook = await BookInfo.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedBook)
            return res.status(404).json({ message: 'Book not found' });

        res.status(200).json({ message: 'Book updated', updatedBook });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// delete book
exports.deleteBook = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'libraryAttendant') {
    return res.status(403).json({ message: "Access denied" });
}

        const deletedBook = await BookInfo.findByIdAndDelete(req.params.id);

        if (!deletedBook)
            return res.status(404).json({ message: 'Book not found' });

        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// borrow book
// exports.borrowBook = async (req,res) => {
//     try{
//          console.log(req.user);
//         if (!req.user || req.user.role !== 'student') {
//     return res.status(403).json({ message: "Only students can borrow books" });
// }

//         const {staffId, returnDate} = req.body;
//         const studentId = req.user.id;

         
//         // validation
//         if(!studentId || !staffId || !returnDate){
//             return res.status(400).json({message: "All fields are required"});
//         }

//         const bookId = req.params.id;
//         const book = await BookInfo.findById(bookId);

//         if(!book)
//             return res.status(404).json({message: 'Book not found'});

//         if(book.status === "OUT")
//             return res.status(400).json({message: 'Book is already out!'});

//         book.status = "OUT";
//         book.borrowedBy = studentId;
//         book.issuedBy = staffId;
//         book.returnDate = returnDate;

//         await book.save();


//         res.status(200).json({message: 'Book borrowed successfully'});
//     }catch(error){
//         return res.status(500).json({message: error.message});   
//     }
// }

// return book
// exports.returnBook = async (req, res) => {
//     try {
//         const bookId = req.params.id;
//         const book = await BookInfo.findById(bookId);

//         if (!req.user || req.user.role !== 'student') {
//     return res.status(403).json({ message: "Only students can return books" });
// }

//         // check if book exists
//         if (!book)
//             return res.status(404).json({ message: 'Book not found' });
        
//         // check if book is already returned
//         if(book.status === "IN"){
//             return res.status(400).json({message: "Book is already returned" });
//         }

//         // reset fields
//         book.status = "IN";
//         book.borrowedBy = null;
//         book.issuedBy = null;
//         book.returnDate = null;

//         await book.save();

//         res.status(200).json({ message: 'Book returned successfully', book });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };


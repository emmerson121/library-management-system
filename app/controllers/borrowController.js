const BookInfo = require('../../models/books')

exports.borrowBook = async (req,res) => {
    try{
         if (!req.user || req.user.role !== 'student') {
    return res.status(403).json({ message: "Only students can borrow books" });
}

        const {staffId, returnDate} = req.body;
        const studentId = req.user.id;

        

        // validation
        if(!studentId || !staffId || !returnDate){
            return res.status(400).json({message: "All fields are required"});
        }

        const bookId = req.params.id;
        const book = await BookInfo.findById(bookId).populate("authors");

        if(!book)
            return res.status(404).json({message: 'Book not found'});

        if(book.status === "OUT")
            return res.status(400).json({message: 'Book is already out!'});

        book.status = "OUT";
        book.borrowedBy = studentId;
        book.issuedBy = staffId;
        book.returnDate = returnDate;

        await book.save();


        res.status(200).json({message: 'Book borrowed successfully'});
    }catch(error){
        return res.status(500).json({message: error.message});   
    }
}


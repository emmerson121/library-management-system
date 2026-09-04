const AuthorInfo = require('../../models/author');

// get all authors
exports.getAuthors = async (req, res) => {
    try {
        const authors = await AuthorInfo.find();
        res.status(200).json(authors);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// get single author
exports.getAuthor = async (req, res) => {
    try {
        const author = await AuthorInfo.findById(req.params.id);

        if (!author) {
            return res.status(404).json({ message: 'Author not found' });
        }

        res.status(200).json(author);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// create author
exports.createAuthor =  async (req, res) => {
    try {
        const { title, bio } = req.body;

        const newAuthor = new AuthorInfo({
            title,
            bio
        });

        const savedAuthor = await newAuthor.save();
        res.status(201).json(savedAuthor);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// update author
exports.updateAuthor = async (req, res) => {
    try {
        const { title, bio } = req.body;

        const updatedAuthor = await AuthorInfo.findByIdAndUpdate(
            req.params.id,
            { title, bio },
            { new: true, runValidators: true }
        );

        if (!updatedAuthor) {
            return res.status(404).json({ message: 'Author not found! Please try again.' });
        }

        res.status(200).json(updatedAuthor);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// delete an author
exports.deleteAuthor = async (req, res) => {
    try {
        const deletedAuthor = await AuthorInfo.findByIdAndDelete(req.params.id);

        if (!deletedAuthor) {
            return res.status(404).json({ message: 'Author not found' });
        }

        res.status(200).json({ message: 'Author deleted successfully' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
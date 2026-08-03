const mongoose = require('mongoose');

const userInfo = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        // unique: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: true,
        minlength: 6
    },

    // 🔐 Role-based system
    role: {
        type: String,
        enum: ['student', 'author', 'libraryAttendant'],
        default: 'student'
    },

    // 👇 Optional fields (useful depending on role)
    bio: {
        type: String   // mainly for authors
    },

    staffId: {
        type: String   // for library attendants
    },

    createdAt: {
        type: Date, 
        default: Date.now
    },

    // 📚 Borrowing relation
    borrowedBooks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }]

}, {
    timestamps: true
});
// module.exports = mongoose.models.User
// module.exports = mongoose.model('User', userInfo);

const User = mongoose.models.User || mongoose.model("User", userInfo);

export default User;
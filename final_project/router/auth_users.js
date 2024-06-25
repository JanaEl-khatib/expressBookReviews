const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = []; // Assuming this will be populated somewhere else

const isValid = (username) => {
    return users.some(user => user.username === username);
}

// Login route for registered users
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if username exists in the database
    if (!isValid(username)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    // Authenticate user
    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ username }, 'your_jwt_secret', { expiresIn: '1h' });
    // If authentication is successful, return success message (no token implementation here)
    return res.status(200).json({ message: "Customer successfully logged in", token });
});


// Add or modify a book review for an authenticated user
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review; // Assuming 'review' is passed as a query parameter
    const username = req.session.username; // Assuming username is stored in session

    // Check if the book with the provided ISBN exists in the database
    if (!(isbn in books)) {
        return res.status(404).json({ message: "Book not found for the provided ISBN" });
    }

    // Initialize reviews object if it doesn't exist for the book
    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    // Add or modify the review for the user
    books[isbn].reviews[username] = review;

    // Determine if it's an update or an addition
    const message = books[isbn].reviews[username] ? "Review updated successfully" : "Review added successfully";

    return res.status(200).json({ message });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username; // Retrieve username from decoded JWT in request object

    // Check if the book with the provided ISBN exists in the database
    if (!(isbn in books)) {
        return res.status(404).json({ message: "Book not found for the provided ISBN" });
    }

    // Check if the book has reviews
    if (!books[isbn].reviews || Object.keys(books[isbn].reviews).length === 0) {
        return res.status(404).json({ message: "No reviews found for this book" });
    }

    // Check if the user has a review for this book
    if (!(username in books[isbn].reviews)) {
        return res.status(404).json({ message: "No review found for this user and ISBN" });
    }

    // Delete the user's review
    delete books[isbn].reviews[username];

    return res.status(200).json({ message: "Review deleted successfully" });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

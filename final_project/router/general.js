const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js"); // Assuming books is a local data source
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Simulating async data fetch with a delay using promises
function fetchBooks() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(books);
        }, 1000); // Simulating delay of 1 second
    });
}

// Get all books available
public_users.get('/', function (req, res) {
    fetchBooks()
        .then(booksList => res.json(booksList))
        .catch(error => res.status(500).json({ message: "Failed to fetch books", error: error.message }));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;

    try {
        // Simulate fetching books (replace with actual fetch logic as needed)
        const booksData = await fetchBooks();

        // Find the book by ISBN
        const book = booksData[isbn];

        // If no book is found, return 404
        if (!book) {
            return res.status(404).json({ message: "Book not found for the provided ISBN" });
        }

        // If the book has no reviews or reviews object is empty, return 404
        if (!book.reviews || Object.keys(book.reviews).length === 0) {
            return res.status(404).json({ message: "No reviews found for this book" });
        }

        // Return reviews associated with the book
        return res.json({ reviews: book.reviews });
    } catch (error) {
        // Handle errors
        return res.status(500).json({ message: "Failed to fetch book details", error: error.message });
    }
});

public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;

    try {
        // Simulate fetching books (replace with actual fetch logic as needed)
        const booksData = await fetchBooks();

        // Filter books by author
        const booksByAuthor = Object.values(booksData).filter(book => book.author === author);

        // If no books are found for the author, return 404
        if (booksByAuthor.length === 0) {
            return res.status(404).json({ message: "Books not found for the provided author" });
        }

        // Return books by the author
        return res.json({ booksByAuthor });
    } catch (error) {
        // Handle errors
        return res.status(500).json({ message: "Failed to fetch books by author", error: error.message });
    }
});

// Get books by title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title.toLowerCase(); // Convert title to lowercase for case-insensitive search

    try {
        // Simulate fetching books (replace with actual fetch logic as needed)
        const booksData = await fetchBooks();

        // Find the book by title
        const book = Object.values(booksData).find(book => book.title.toLowerCase() === title);

        // If no book is found, return 404
        if (!book) {
            return res.status(404).json({ message: "Book not found for the provided title" });
        }

        // Return book details including author, id, and reviews (or an empty array if no reviews exist)
        return res.json({
            isbn: book.isbn,
            author: book.author,
            reviews: book.reviews || [] // Return an empty array if reviews are not defined or empty
        });
    } catch (error) {
        // Handle errors
        return res.status(500).json({ message: "Failed to fetch book details", error: error.message });
    }
});


// Get reviews for a specific book by ISBN
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    // Assuming books is fetched from an external API as well
    fetchBooks()
        .then(booksList => {
            const book = booksList.find(book => book.isbn === isbn);
            if (!book) {
                return res.status(404).json({ message: "Book not found for the provided ISBN" });
            }
            if (!book.reviews || Object.keys(book.reviews).length === 0) {
                return res.status(404).json({ message: "No reviews found for this book" });
            }
            return res.json({ reviews: book.reviews });
        })
        .catch(error => res.status(500).json({ message: "Failed to fetch books", error: error.message }));
});

module.exports.general = public_users;

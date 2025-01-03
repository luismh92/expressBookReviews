const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
let books = require("./booksdb.js");
const regd_users = express.Router();
const JWT_SECRET = 'your_jwt_secret_key'; 
let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    const user = !users.find((u)=> u?.username === username)
    return !user
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    return users.find((u)=> username === username && password === password)
}


//only registered users can login
regd_users.post("/login", async (req, res) => {
    const { username, password } = req.body;
  
    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    // Find the user by username
    const user = users.find(u => u.username === username);
    // If user doesn't exist or password doesn't match, return an error
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    console.log(2, password, user.password)
    // Compare the provided password with the hashed password stored in the database
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
  
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
  
    // If credentials are valid, create a JWT
    const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
  
    // Send the JWT to the client
    return res.status(200).json({
      message: "Login successful",
      token: token // Provide the JWT in the response
    });
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    console.log(req.params)
    const isbn = req.params.isbn
    
    const review = req.body.review;
    const username = req.username;  // Extract the logged-in user's username
  
    if (!review || review.trim() === "") {
      return res.status(400).json({ message: "Review cannot be empty" });
    }
  
    // Check if the ISBN exists in the books data
    const book = books[isbn];
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Check if the user already has a review for the given ISBN
    if (book.reviews[username]) {
      // Modify existing review if the user has already posted one
      book.reviews[username] = review;
      return res.status(200).json({ message: "Review updated successfully" });
    } else {
      // Add new review if the user hasn't posted one
      book.reviews[username] = review;
      return res.status(201).json({ message: "Review added successfully" });
    }
  });


// DELETE route to remove a review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.username; // Get the logged-in user's username
  
    // Check if the book exists
    const book = books[isbn];
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Check if the user has a review for this ISBN
    if (!book.reviews[username]) {
      return res.status(400).json({ message: "No review found to delete" });
    }
  
    // Delete the review
    delete book.reviews[username];
  
    // Respond with success message
    return res.status(200).json({ message: "Review deleted successfully" });
  });
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

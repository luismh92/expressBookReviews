const express = require('express');
const bcrypt = require('bcrypt');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", async (req,res) => {
  //Write your code here
  const username = req.body.username
  const password = req.body.password

  if(!password===true){
    return res.status(400).json({message: "Password not provided"})
  }else if (!username===true){
    return res.status(400).json({message: "Username not provided"})
  }else if(isValid(username) == true){
    return res.status(300).json({message: "User not valid"}); 
  }else{
    const hashedPassword = await bcrypt.hash(password, 10);  // Hash the password with salt rounds
    // Store the user with the hashed password
    users.push({ username, password: hashedPassword });
    return res.status(300).json({message: "User register succesfully"}); 
  }
    
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    // Wrap the logic inside a Promise to simulate an async operation
    new Promise((resolve, reject) => {
      // Simulate the asynchronous operation of fetching books
      const booksData = books;  // In real use, this might be a database query or API call
  
      if (booksData && Object.values(booksData).length > 0) {
        resolve(booksData);  // If books exist, resolve the Promise with the data
      } else {
        reject('No books available');  // If no books are available, reject the Promise with an error
      }
    })
    .then((result) => {
      // If the Promise resolves successfully, send the books data as a response
      return res.status(200).json(result);  // Return the books as JSON
    })
    .catch((error) => {
      // If the Promise is rejected, send an error response
      return res.status(404).json({ message: error });  // Return a 404 error with a message
    });
  });
  

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
  
    // Wrap the logic inside a Promise
    new Promise((resolve, reject) => {
      // Simulate an asynchronous action (e.g., looking up a book in a database)
      const book = books[isbn];  // Fetch the book using the ISBN
  
      if (book) {
        resolve(book);  // If the book is found, resolve the Promise with the book data
      } else {
        reject('Book not found');  // If the book is not found, reject the Promise with an error message
      }
    })
      .then((book) => {
        // If the Promise resolves successfully, send the book as a response
        return res.status(200).json(book);
      })
      .catch((error) => {
        // If the Promise is rejected (e.g., book not found), send an error response
        return res.status(404).json({ message: error });
      });
  });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
  
    // Wrap the logic inside a Promise
    new Promise((resolve, reject) => {
      // Simulate the asynchronous operation of filtering books by author
      const result = Object.values(books).filter(book => book.author === author);
  
      if (result.length > 0) {
        resolve(result);  // If books are found, resolve the Promise with the result
      } else {
        reject('No books found for this author');  // If no books are found, reject with an error message
      }
    })
    .then((result) => {
      // If the Promise resolves successfully, send the result as a response
      return res.status(200).json(result);
    })
    .catch((error) => {
      // If the Promise is rejected (e.g., no books found), send an error response
      return res.status(404).json({ message: error });
    });
  });

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
  
    // Wrap the logic inside a Promise
    new Promise((resolve, reject) => {
      // Simulate an asynchronous operation of filtering books by title
      const result = Object.values(books).filter(book => book.title === title);
  
      if (result.length > 0) {
        resolve(result);  // If books are found, resolve the Promise with the result
      } else {
        reject('No books found with this title');  // If no books are found, reject with an error message
      }
    })
    .then((result) => {
      // If the Promise resolves successfully, send the result as a response
      return res.status(200).json(result);  // Return the filtered books as JSON
    })
    .catch((error) => {
      // If the Promise is rejected (e.g., no books found), send an error response
      return res.status(404).json({ message: error });  // Return a 404 error with the message
    });
  });
  

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  const book = Object.values(books).filter(book => book?.isbn === parseInt(isbn))
  return res.status(300).json(book);
});

module.exports.general = public_users;

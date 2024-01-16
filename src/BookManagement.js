import React, { useState, useEffect } from 'react';
import axios from 'axios';

function BookManagement() 
{
  
  //creating state of 
  //1.reading books 
  //2. creating new books 
  // 3.updating a book
  // 4.showing a updated book data or form




//reading books
  const [books, setBooks] = useState([]);//array


  // creating new books
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    publishedYear: '',
  });//object


// updating a book
  const [updateBookData, setUpdateBookData] = useState({
    id: null,
    title: '',
    author: '',
    publishedYear: '',
  });


  // showing a updated book data or form

  const [showUpdateForm, setShowUpdateForm] = useState(false);
  


  // getting  all books from backend and setting to setBook(get)
  useEffect(() => 
  {
    // Fetch books from the backend when the component mounts
    // http://localhost:3003/books this is a link used to get books in backend

    axios.get('http://localhost:3003/books')
      .then(response => setBooks(response.data))
      .catch(error => console.error('Error fetching books:', error));
  }, []);
  // empty array as secong argument because  makes render  components only once




  // adding book in front end and also make reflect in backend also(post)
  // link used to add book in backend http://localhost:3003/books/add
  const addBook = () => 
  {  // add newBook and set in Books
    axios.post('http://localhost:3003/books/add', newBook)
      .then(response => setBooks([...books, response.data]))
      .catch(error => console.error('Error adding book:', error));

    setNewBook({
      title: '',
      author: '',
      publishedYear: '',
    });
  };






  // updating a book datan based on id passed by user(check book contain that id ,if match founfd update with user sended title author published year)
  const updateBook = () => {
    axios.put(`http://localhost:3003/books/update/${updateBookData.id}`, updateBookData)
      .then(response => {
        const updatedBooks = books.map(book => {
          if (book.id === updateBookData.id) 
          {
            return { ...book, ...updateBookData };
          }
          return book;
        });
        setBooks(updatedBooks);
        setShowUpdateForm(false); // Close the update form after successful update
      })
      .catch(error => console.error('Error updating book:', error));
  };






  // for deleting i am not defined any sate like a deleteBookData,hence i axios.delete not passed as second parameter hence i am accepting id
  const deleteBook = (bookId) => {
    axios.delete(`http://localhost:3003/books/delete/${bookId}`)
      .then(response => {
        //  filter Returns the elements of an array that meet the condition specified in a callback function.
        const updatedBooks = books.filter(book => book.id !== bookId);
        setBooks(updatedBooks);
      })
      .catch(error => console.error('Error deleting book:', error));
  };





// opening a update from

  const openUpdateForm = (book) => 
  {
    setUpdateBookData(book);
    setShowUpdateForm(true);
  };

  // close  a update from after updation

  const closeUpdateForm = () => {
    setUpdateBookData({
      id: null,
      title: '',
      author: '',
      publishedYear: '',
    });
    setShowUpdateForm(false);
  };



return (
  <div>
       <h1>Book Management</h1>
       // printing already entered book details  title by author published in publish year -update-delete
           <ul>
             {books.map(book => (
                 <li key={book.id}>
                   <strong>{book.title}</strong> by {book.author}, published in {book.publishedYear}
                  <button onClick={() => openUpdateForm(book)}>Update</button>
                  <button onClick={() => deleteBook(book.id)}>Delete</button>
                </li>
                                )
                       )
             }
        </ul>
    / 
    // adding book with add book button 
     <div>
        <input
          type="text"
          placeholder="Title"
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Author"
          value={newBook.author}
          onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
        />
      
        <input
          type="text"
          placeholder="Published Year"
          value={newBook.publishedYear}
          onChange={(e) => setNewBook({ ...newBook, publishedYear: e.target.value })}
        />
        <button onClick={addBook}>Add Book</button>
     </div>


// show update from is true 
    {showUpdateForm && 
      (
        <div>
          <h2>Update Book</h2>
          <input
            type="text"
            placeholder="Title"
            value={updateBookData.title}
            onChange={(e) => setUpdateBookData({ ...updateBookData, title: e.target.value })}
          />

          <input
            type="text"
            placeholder="Author"
            value={updateBookData.author}
            onChange={(e) => setUpdateBookData({ ...updateBookData, author: e.target.value })}
          />
          <input
            type="text"
            placeholder="Published Year"
            value={updateBookData.publishedYear}
            onChange={(e) => setUpdateBookData({ ...updateBookData, publishedYear: e.target.value })}
          />
          <button onClick={updateBook}>Update Book</button>
          <button onClick={closeUpdateForm}>Cancel</button>
         </div>
      )
    }
  
  </div>
);
}

export default BookManagement;

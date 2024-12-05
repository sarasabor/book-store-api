import Book from '../models/Book.js';

//* Controller to get All The Books
export const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: 'Failed To Fetch Books', error});
    }
}

//* Controller to Add a New Book 
export const addBook = async(req, res) => {
    try {
        const { title, author, year, description, genre, img, price, oldPrice } = req.body;

        const newBook = new Book({title, author, year, description, genre, img, price, oldPrice});

        if(!newBook) return res.status(404).json({message: 'Book Not Found'});

        await newBook.save();

        //* if Book Added Successfully 
        res.status(201).json({message: 'Book Added Successfully', newBook});

    } catch (error) {
        res.status(500).json({ message: 'Failed To Fetch Books', error});
    }
}

//* Contorller to get a single Book by its ID 
export const getBookById = async(req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);

        if(!book) return res.status(404).json({message: 'Book Not Found'});

        //* if The Book is Successfully Fetched
        res.status(200).json(book);
        
    } catch (error) {
        res.status(500).json({ message: 'Failed To Fetch Books', error});
    }
}

//* Controller to Delete A Book 
export const deleteBook = async(req, res) => {
    try {
        const { id } = req.params;
        const deletedBook = await Book.findByIdAndDelete(id);

        if(!deletedBook) return res.status(404).json({message: 'Book Not Found'});

        res.status(200).json({message: 'Book is Deleted', deletedBook});

    } catch (error) {
        res.status(500).json({ message: 'Failed To Fetch Books', error}); 
    }
}

//* Controller To Update Book by ID 
export const updateBook = async(req, res) => {
    try {
        const { id } = req.params;
        const updatedBook = await Book.findByIdAndUpdate(id, req.body);

        if(!updatedBook) return res.status(404).json({message: 'Book Not Found'});

        res.status(200).json({message: 'Book Updated Successfully', updatedBook});
    } catch (error) {
        res.status(500).json({ message: 'Failed To Fetch Books', error});
    }
}

//* Controller To Get Book By its Genre
export const getBookByGenre = async(req, res) => {
    try {
        const { genre } = req.params;
        const booksByGenre = await Book.find({ genre });
        if(!booksByGenre) return res.status(404).json({message: 'Genre Not Found'});


        res.status(200).json({message: 'BOOK FOUND', booksByGenre});
    } catch (error) {
        res.status(500).json({message: 'Failed To Fetch books', error});
    }
}
const Book = require('../models/Book');
const { validate, createBookSchema } = require('../utils/validation');

exports.getBooks = async (req, res, next) => {
  try {
    const { search, category, condition, limit = 10, offset = 0 } = req.query;

    const filters = {};
    if (search) filters.search = search;
    if (category) filters.category = category;
    if (condition) filters.condition = condition;

    const books = await Book.findAll(parseInt(limit), parseInt(offset), filters);

    res.json({
      success: true,
      data: books.map((book) => ({
        id: book.id,
        userId: book.user_id,
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        description: book.description,
        category: book.category,
        condition: book.condition,
        bookImage: book.book_image,
        isAvailable: book.is_available,
        createdAt: book.created_at,
      })),
    });
  } catch (error) {
    next(error);
  }
};

exports.getBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const book = await Book.getBookWithOwner(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    res.json({
      success: true,
      data: {
        id: book.id,
        userId: book.user_id,
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        description: book.description,
        category: book.category,
        condition: book.condition,
        bookImage: book.book_image,
        isAvailable: book.is_available,
        owner: {
          id: book.user_id,
          name: book.owner_name,
          email: book.owner_email,
          phone: book.owner_phone,
        },
        createdAt: book.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.createBook = async (req, res, next) => {
  try {
    const { isValid, value, details } = validate(createBookSchema, req.body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        details,
      });
    }

    const book = await Book.create({
      userId: req.userId,
      ...value,
    });

    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: {
        id: book.id,
        userId: book.user_id,
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        description: book.description,
        category: book.category,
        condition: book.condition,
        bookImage: book.book_image,
        isAvailable: book.is_available,
        createdAt: book.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    if (book.user_id !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this book',
      });
    }

    const updatedBook = await Book.update(id, req.body);

    res.json({
      success: true,
      message: 'Book updated successfully',
      data: {
        id: updatedBook.id,
        userId: updatedBook.user_id,
        title: updatedBook.title,
        author: updatedBook.author,
        isbn: updatedBook.isbn,
        description: updatedBook.description,
        category: updatedBook.category,
        condition: updatedBook.condition,
        bookImage: updatedBook.book_image,
        isAvailable: updatedBook.is_available,
        updatedAt: updatedBook.updated_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    if (book.user_id !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this book',
      });
    }

    await Book.delete(id);

    res.json({
      success: true,
      message: 'Book deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserBooks = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    const books = await Book.findByUserId(userId, parseInt(limit), parseInt(offset));

    res.json({
      success: true,
      data: books.map((book) => ({
        id: book.id,
        userId: book.user_id,
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        description: book.description,
        category: book.category,
        condition: book.condition,
        bookImage: book.book_image,
        isAvailable: book.is_available,
        createdAt: book.created_at,
      })),
    });
  } catch (error) {
    next(error);
  }
};

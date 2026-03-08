const User = require('../models/User');
const Book = require('../models/Book');
const Exchange = require('../models/Exchange');
const pool = require('../config/database');

exports.getAnalytics = async (req, res, next) => {
  try {
    const usersCountResult = await pool.query('SELECT COUNT(*) FROM users WHERE is_active = TRUE');
    const booksCountResult = await pool.query('SELECT COUNT(*) FROM books');
    const exchangesCountResult = await pool.query('SELECT COUNT(*) FROM exchanges');
    const completedExchangesResult = await pool.query(
      "SELECT COUNT(*) FROM exchanges WHERE status = 'COMPLETED'"
    );

    const data = {
      totalUsers: parseInt(usersCountResult.rows[0].count),
      totalBooks: parseInt(booksCountResult.rows[0].count),
      totalExchanges: parseInt(exchangesCountResult.rows[0].count),
      completedExchanges: parseInt(completedExchangesResult.rows[0].count),
    };

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    const users = await User.findAll(parseInt(limit), parseInt(offset));

    res.json({
      success: true,
      data: users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        profilePicture: user.profile_picture,
        isAdmin: user.is_admin,
        createdAt: user.created_at,
      })),
    });
  } catch (error) {
    next(error);
  }
};

exports.blockUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    await User.delete(id);

    res.json({
      success: true,
      message: 'User blocked successfully',
    });
  } catch (error) {
    next(error);
  }
};

exports.getBooks = async (req, res, next) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    const booksResult = await pool.query(
      `SELECT b.*, u.name as owner_name, u.email as owner_email
       FROM books b
       JOIN users u ON b.user_id = u.id
       ORDER BY b.created_at DESC
       LIMIT $1 OFFSET $2`,
      [parseInt(limit), parseInt(offset)]
    );

    res.json({
      success: true,
      data: booksResult.rows.map((book) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        ownerName: book.owner_name,
        ownerEmail: book.owner_email,
        condition: book.condition,
        isAvailable: book.is_available,
        createdAt: book.created_at,
      })),
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteBookAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
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

exports.getReports = async (req, res, next) => {
  try {
    // Placeholder for reports functionality
    res.json({
      success: true,
      data: [],
      message: 'Reports functionality to be implemented',
    });
  } catch (error) {
    next(error);
  }
};

exports.resolveReport = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Placeholder for report resolution
    res.json({
      success: true,
      message: 'Report resolved successfully',
    });
  } catch (error) {
    next(error);
  }
};

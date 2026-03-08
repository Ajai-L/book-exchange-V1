const Exchange = require('../models/Exchange');
const Book = require('../models/Book');
const { validate, createExchangeSchema } = require('../utils/validation');

exports.getExchanges = async (req, res, next) => {
  try {
    const { status, limit = 10, offset = 0 } = req.query;

    if (status) {
      const exchanges = await Exchange.findByStatus(status.toUpperCase(), parseInt(limit), parseInt(offset));
      return res.json({
        success: true,
        data: formatExchanges(exchanges),
      });
    }

    const exchanges = await Exchange.findByUserId(req.userId, parseInt(limit), parseInt(offset));

    res.json({
      success: true,
      data: formatExchanges(exchanges),
    });
  } catch (error) {
    next(error);
  }
};

exports.getExchange = async (req, res, next) => {
  try {
    const { id } = req.params;
    const exchange = await Exchange.findById(id);

    if (!exchange) {
      return res.status(404).json({
        success: false,
        message: 'Exchange not found',
      });
    }

    res.json({
      success: true,
      data: formatExchange(exchange),
    });
  } catch (error) {
    next(error);
  }
};

exports.createExchange = async (req, res, next) => {
  try {
    const { isValid, value, details } = validate(createExchangeSchema, req.body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        details,
      });
    }

    const { bookOfferedId, bookRequestedId, message } = value;

    const bookOffered = await Book.findById(bookOfferedId);
    const bookRequested = await Book.findById(bookRequestedId);

    if (!bookOffered || !bookRequested) {
      return res.status(404).json({
        success: false,
        message: 'One or both books not found',
      });
    }

    if (bookRequested.user_id === req.userId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot exchange with yourself',
      });
    }

    const exchange = await Exchange.create({
      bookOfferedId,
      bookRequestedId,
      initiatorId: req.userId,
      responderId: bookRequested.user_id,
      message,
    });

    const createdExchange = await Exchange.findById(exchange.id);

    res.status(201).json({
      success: true,
      message: 'Exchange request created successfully',
      data: formatExchange(createdExchange),
    });
  } catch (error) {
    next(error);
  }
};

exports.updateExchange = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const exchange = await Exchange.findById(id);

    if (!exchange) {
      return res.status(404).json({
        success: false,
        message: 'Exchange not found',
      });
    }

    if (exchange.responder_id !== req.userId && exchange.initiator_id !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this exchange',
      });
    }

    const validStatuses = ['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(status.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const updatedExchange = await Exchange.updateStatus(id, status.toUpperCase());
    const fullExchange = await Exchange.findById(id);

    res.json({
      success: true,
      message: 'Exchange updated successfully',
      data: formatExchange(fullExchange),
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteExchange = async (req, res, next) => {
  try {
    const { id } = req.params;
    const exchange = await Exchange.findById(id);

    if (!exchange) {
      return res.status(404).json({
        success: false,
        message: 'Exchange not found',
      });
    }

    if (exchange.initiator_id !== req.userId && exchange.responder_id !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this exchange',
      });
    }

    await Exchange.delete(id);

    res.json({
      success: true,
      message: 'Exchange deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

function formatExchange(exchange) {
  return {
    id: exchange.id,
    bookOfferedId: exchange.book_offered_id,
    bookOfferedTitle: exchange.book_offered_title,
    bookOfferedAuthor: exchange.book_offered_author,
    bookOfferedImage: exchange.book_offered_image,
    bookRequestedId: exchange.book_requested_id,
    bookRequestedTitle: exchange.book_requested_title,
    bookRequestedAuthor: exchange.book_requested_author,
    bookRequestedImage: exchange.book_requested_image,
    initiatorId: exchange.initiator_id,
    initiatorName: exchange.initiator_name,
    initiatorEmail: exchange.initiator_email,
    responderId: exchange.responder_id,
    responderName: exchange.responder_name,
    responderEmail: exchange.responder_email,
    status: exchange.status,
    message: exchange.message,
    exchangeDate: exchange.exchange_date,
    createdAt: exchange.created_at,
    updatedAt: exchange.updated_at,
  };
}

function formatExchanges(exchanges) {
  return exchanges.map((exchange) => ({
    id: exchange.id,
    bookOfferedTitle: exchange.book_offered_title,
    bookOfferedAuthor: exchange.book_offered_author,
    bookRequestedTitle: exchange.book_requested_title,
    bookRequestedAuthor: exchange.book_requested_author,
    status: exchange.status,
    createdAt: exchange.created_at,
  }));
}

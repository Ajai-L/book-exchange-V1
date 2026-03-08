const responseHandler = (res, status, message, data = null) => {
  const response = {
    success: status < 400,
    message,
  };

  if (data) {
    response.data = data;
  }

  res.status(status).json(response);
};

module.exports = { responseHandler };

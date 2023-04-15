const errorHandler = (error, req, res, next) => {
  console.error(error);
  console.log("======", error.name);
  if (error.name === "CastError") {
    return res.status(400).send({ ERROR: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

module.exports = errorHandler;

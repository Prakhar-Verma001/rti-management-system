export const errorHandler = (err, req, res, next) => {
  console.error(err);
  // Handle Mongoose validation errors and express-validator formatted errors
  if (err && err.name === "ValidationError" && err.errors) {
    const errors = Object.keys(err.errors).map((field) => ({ field, message: err.errors[field].message }));
    return res.status(400).json({ message: err.message || "Validation failed", errors });
  }

  const status = err.status || 500;
  const message = err.message || "Internal server error";
  res.status(status).json({ message });
};

const express = require("express");
require("dotenv").config();
const userRoutes = require("./routes/users");
const articleRoutes = require("./routes/articles");
const { authenticateJWT } = require("./middleware/auth");
const { NotFoundError } = require("./expressError");

const app = express();

app.use(express.json());
app.use(authenticateJWT);
app.use("/users", userRoutes);
app.use("/articles", articleRoutes);

app.use(function (req, res, next) {
  return next(new NotFoundError());
});

app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;

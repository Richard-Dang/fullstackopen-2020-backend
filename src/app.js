const express = require("express");
const requestLogger = require("./middlewares/requestLogger");
const app = express();
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const config = require("./utils/config");
const mongoose = require("mongoose");
const logger = require("./utils/logger");
const personsRouter = require("./routes/persons");

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((err) => {
    logger.info("error connect to MongoDB:", err.message);
  });

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(requestLogger());

app.use("/api/persons", personsRouter);

app.use(errorHandler);

module.exports = app;

const morgan = require("morgan");

const requestLogger = () => {
  morgan.token("data", (req) => {
    return JSON.stringify(req.body);
  });

  return morgan(
    ":method :url :status :res[content-length] - :response-time ms :data"
  );
};

module.exports = requestLogger;

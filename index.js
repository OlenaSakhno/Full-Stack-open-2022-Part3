const express = require("express");
const dotenv = require("dotenv");
var morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
// const errorHandler = require("./middleware/errorHandler");
dotenv.config();
const app = express();

app.use(express.static("build"));
app.use(express.json());
app.use(cors());

morgan.token("requestPOST", function (req, res) {
  return JSON.stringify(req.body);
});
morgan.token("requestGETone", function (req, res) {
  return `requested person=>${req.params.id}`;
});
const errorHandler = (error, req, res, next) => {
  console.error(error);
  console.log("======", error.name);
  if (error.name === "CastError") {
    return res.status(400).send({ ERROR: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }
  next(error);
};
app.use(errorHandler); // this has to be the last loaded middleware.
const morganConfPOST =
  ":method :url :status :res[content-length] - :response-time ms :requestPOST";
const morganConfGETone =
  ":method :url :status :res[content-length] - :response-time ms :requestGETone";
app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((result) => {
    res.json(result);
  });
});

app.get("/api/info", (req, res) => {
  const phones = Person.find({}).length;

  console.log(phones);
  res
    .status(200)
    .send(`Phonebook has info for ${phones} people` + `<p>${new Date()}<p>`);
});
app.get(
  "/api/persons/:id",
  /*morgan(morganConfGETone),*/ (req, res, next) => {
    const id = req.params.id;
    Person.findById(id)
      .then((person) => {
        if (person) res.json(person);
        else res.status(404).send("The record does not exist");
      })
      .catch((error) => next(error));
  }
);

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", morgan(morganConfPOST), (req, res, next) => {
  const body = req.body;
  console.log("body=>", body);

  if (body.name === "" || body.number === "") {
    return res.status(400).json({
      error: "name or/and number missing",
    });
  }
  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedRecord) => {
      res.json(savedRecord);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", morgan(morganConfPOST), (req, res, next) => {
  const body = req.body;
  const person = {
    name: body.name,
    number: body.number,
  };
  Person.findByIdAndUpdate(req.params.id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedRecord) => {
      res.json(updatedRecord);
    })
    .catch((error) => next(error));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

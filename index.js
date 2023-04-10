const express = require("express");
const dotenv = require("dotenv");
var morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const Person = require("./models/person");
dotenv.config();
const app = express();
app.use(express.json());

app.use(cors());
app.use(express.static("build"));

morgan.token("requestPOST", function (req, res) {
  return JSON.stringify(req.body);
});
morgan.token("requestGETone", function (req, res) {
  return `requested person=>${req.params.id}`;
});

// const name = process.argv[3];
// const phone = process.argv[4];

// const url = process.env.MONGODB_URI;

// mongoose.set("strictQuery", false);
// mongoose
//   .connect(url)
//   .then((result) => {
//     console.log("connected to MongoDB");
//   })
//   .catch((error) => {
//     console.log("error connecting to MongoDB:", error.message);
//   });

// const personSchema = new mongoose.Schema({
//   name: String,
//   number: String,
// });
// const Person = mongoose.model("Person", personSchema);

// const person = new Person({
//   name,
//   number: phone,
// });

// let phones = [
//   {
//     id: 1,
//     name: "Arto Hellas",
//     number: "040-123456",
//   },
//   {
//     id: 2,
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//   },
//   {
//     id: 3,
//     name: "Dan Abramov",
//     number: "12-43-234345",
//   },
//   {
//     id: 4,
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//   },
//   {
//     id: 5,
//     name: "Olena Sakhno",
//     number: "39-23-6423122",
//   },
// ];

//app.use(morgan("tiny"));  // this will show logs for all routs
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
  res
    .status(200)
    .send(
      `Phonebook has info for ${phones.length} people` + `<p>${new Date()}<p>`
    );
});
app.get("/api/persons/:id", morgan(morganConfGETone), (req, res) => {
  const id = req.params.id;
  const phone = Person.findById(id).then((person) => {
    if (phone) res.json(phone);
    else res.status(404).send("The record does not exist").end();
  });

  // console.log("id===", id);
  // const phone = phones.find((phone) => phone.id === id);
  // if (phone) res.json(phone);
  // else res.status(404).send("The record does not exist").end();
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  phones = phones.filter((phone) => phone.id !== id);
  console.log(phones);
  res.status(204).send(`record ${id} was deleted`).end();
});

app.post("/api/persons", morgan(morganConfPOST), (req, res) => {
  const body = req.body;
  console.log("body=>", body);

  if (body.name === "" || body.number === "") {
    return res.status(400).json({
      error: "name or/and number missing",
    });
  }
  // else if (phones.find((phone) => phone.name === body.name)) {
  //   return res.status(400).json({
  //     error: "name must be unique   ",
  //   });
  // }
  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedRecord) => {
    res.json(savedRecord);
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

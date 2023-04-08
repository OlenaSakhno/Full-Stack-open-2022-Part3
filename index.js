const express = require("express");
const dotenv = require("dotenv");
var morgan = require("morgan");
const cors = require("cors");
dotenv.config();
const app = express();
app.use(express.json());

app.use(cors());

morgan.token("requestPOST", function (req, res) {
  return JSON.stringify(req.body);
});
morgan.token("requestGETone", function (req, res) {
  return `requested person=>${req.params.id}`;
});

let phones = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
  {
    id: 5,
    name: "Olena Sakhno",
    number: "39-23-6423122",
  },
];

//app.use(morgan("tiny"));  // this will show logs for all routs
const morganConfPOST =
  ":method :url :status :res[content-length] - :response-time ms :requestPOST";
const morganConfGETone =
  ":method :url :status :res[content-length] - :response-time ms :requestGETone";
app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (req, res) => {
  res.json(phones);
});
app.get("/api/info", (req, res) => {
  res
    .status(200)
    .send(
      `Phonebook has info for ${phones.length} people` + `<p>${new Date()}<p>`
    );
});
app.get("/api/persons/:id", morgan(morganConfGETone), (req, res) => {
  const id = Number(req.params.id);
  console.log("id===", id);
  const phone = phones.find((phone) => phone.id === id);
  if (phone) res.json(phone);
  else res.status(404).send("The record does not exist").end();
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
  } else if (phones.find((phone) => phone.name === body.name)) {
    return res.status(400).json({
      error: "name must be unique   ",
    });
  }

  const id = Math.floor(Math.random() * 1000000);
  const dataToPost = { id, ...body };
  console.log(dataToPost);
  phones = phones.push(dataToPost);
  console.log("phones", phones);
  res.json(dataToPost);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

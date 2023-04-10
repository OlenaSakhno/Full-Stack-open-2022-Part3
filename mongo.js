const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const phone = process.argv[4];

const url = `mongodb+srv://olenasakhno:${password}@cluster0.fcumclu.mongodb.net/FullStackOpen?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});
const Person = mongoose.model("Person", personSchema);

const person = new Person({
  name,
  number: phone,
});

Person.find({}).then((result) => {
  result.forEach((person, i) => {
    console.log("document", i, person);
  });
  mongoose.connection.close();
});

if (process.argv.length > 3) {
  person.save().then((result) => {
    console.log(`person record saved! ${result}`);
    mongoose.connection.close();
  });
}

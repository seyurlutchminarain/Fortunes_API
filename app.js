const fs = require("fs");
const express = require("express"); //TODO need to install dependency
const bodyParser = require("body-parser"); //TODO need to install dependency
const app = express();
const fortunes = require("./data/fortunes");

app.use(bodyParser.json());

app.get("/fortunes", (req, res) => {
  // params are the endpoint and a callback function. REQ and RES is request and response
  res.json(fortunes); // response from the endpoint
});

app.get("/fortunes/random", (req, res) => {
  // Picks a random index according to th length of the array
  res.json(fortunes[Math.floor(Math.random() * fortunes.length)]);
});

app.get("/fortunes/:id", (req, res) => {
  //!! select a specific index using colon [FEATURE OF EXPRESS]
  // if we enforce type checking we wont get desired response
  res.json(fortunes.find((f) => f.id == req.params.id));
});

const writeFortunes = (json) => {
  fs.writeFile("./data/fortunes.json", JSON.stringify(json), (err) => {
    // 3rd param is error
    console.log(err);
  });
};

app.post("/fortunes", (req, res) => {
  const { message, lucky_number, spirit_animal } = req.body;
  const fortune_ids = fortunes.map((f) => f.id); // returns an array of IDs

  const new_fortunes = fortunes.concat({
    id: (fortune_ids.length > 0 ? Math.max(...fortune_ids) : 0) + 1, // Takes care of edge case when data is empty and max returns neg inf
    message,
    lucky_number,
    spirit_animal,
  });

  //! 1st param is file location, 2nd param is what to write
  writeFortunes(new_fortunes);
  res.json(fortunes);
});

app.put("/fortunes/:id", (req, res) => {
  const { id } = req.params; //! Destruction syntax, gets the values directly from the request body/ params

  const old_fortune = fortunes.find((f) => f.id == id);
  ["message", "lucky_number", "spirit_animal"].forEach((key) => {
    if (req.body[key]) old_fortune[key] = req.body[key];
  });

  writeFortunes(fortunes);
  res.json(fortunes);
}); // Updates existing records

app.delete("/fortunes/:id", (req, res) => {
  const { id } = req.params;

  const new_fortunes = fortunes.filter((f) => f.id != id); // return all except that ID --> convenient "delete"
  writeFortunes(new_fortunes);
  res.json(new_fortunes);
});

module.exports = app; // exporting app as a module so other files can require and use it

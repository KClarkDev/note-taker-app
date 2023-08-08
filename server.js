const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid"); // npm package to generate unique IDs

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static("public")); // Sets up middleware to serve static files from /public

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// API Routes

// Retrieve existing notes
app.get("/api/notes", (req, res) => {
  fs.readFile(path.join(__dirname, "db", "db.json"), "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to read the database" });
    }

    try {
      const notes = JSON.parse(data); // an array of objects
      res.json(notes);
    } catch (parseError) {
      console.error(parseError);
      return res.status(500).json({ error: "Failed to parse the database" });
    }
  });
});

// Write and save a new note
app.post("/api/notes", (req, res) => {
  const newNote = req.body;

  // Assign a unique ID to the new note using uuidv4() from the npm package
  newNote.id = uuidv4();

  fs.readFile(path.join(__dirname, "db", "db.json"), "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to read the database" });
    }

    try {
      const notes = JSON.parse(data);
      notes.push(newNote);

      fs.writeFile(
        path.join(__dirname, "db", "db.json"),
        JSON.stringify(notes),
        (writeErr) => {
          if (writeErr) {
            console.error(writeErr);
            return res
              .status(500)
              .json({ error: "Failed to write to the database" });
          }

          res.json(newNote);
        }
      );
    } catch (parseError) {
      console.error(parseError);
      return res.status(500).json({ error: "Failed to parse the database" });
    }
  });
});

// Delete Notes
app.delete("/api/notes/:id", (req, res) => {
  const idToDelete = req.params.id;

  fs.readFile(path.join(__dirname, "db", "db.json"), "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to read the database" });
    }

    try {
      let notes = JSON.parse(data);
      notes = notes.filter((child) => child.id !== idToDelete);

      fs.writeFile(
        path.join(__dirname, "db", "db.json"), //path
        JSON.stringify(notes), //data
        (writeErr) => {
          if (writeErr) {
            console.error(writeErr);
            return res
              .status(500)
              .json({ error: "Failed to write to the database" });
          }
        }
      );
      return res.status(200).json({ success: true });
    } catch (parseError) {
      console.error(parseError);
      return res.status(500).json({ error: "Failed to parse the database" });
    }
  });
});

/////////////////////////////

// HTML Routes
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

//////////////////////////////

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid"); // npm package to generate unique IDs

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static("public")); // Sets up middleware to serve static files from /public
// STUDY NOTE: this means that any files placed in the "public" directory can be accessed by the client directly through the URL, without requiring any additional routing.

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// HTML Routes
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// API Routes
app.get("/api/notes", (req, res) => {
  fs.readFile(path.join(__dirname, "db", "db.json"), "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to read the database" });
    }

    try {
      const notes = JSON.parse(data);
      res.json(notes);
    } catch (parseError) {
      console.error(parseError);
      return res.status(500).json({ error: "Failed to parse the database" });
    }
  });
});

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

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

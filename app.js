const connection = require("./db-config");
const express = require("express");
const app = express();

const port = process.env.PORT || 3000;

connection.connect((err) => {
  if (err) {
    console.error("error connecting: " + err.stack);
  } else {
    console.log(
      "connected to database with threadId :  " + connection.threadId
    );
  }
});

app.use(express.json());

//GET ALL CATEGORIES
app.get("/categories", function (req, res) {
  connection
    .promise()
    .query("SELECT * FROM categories")
    .then(([results]) => {
      res.json(results);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error retrieving the categories from tdatabase");
    });
});

// GET ONE CATEGORY
app.get("/categories/:id", function (req, res) {
  const { id } = req.params;
  connection
    .promise()
    .query("SELECT * FROM categories c WHERE c.id = ?", [id])
    .then(([results]) => {
      res.json(results);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error retrieving the category from the database");
    });
});

//DELETE CATEGORY
app.delete("/categories/:id", function (req, res) {
  const { id } = req.params;
  connection
    .promise()
    .query("DELETE FROM categories c WHERE c.id = ?", [id])
    .then(() => {
      res.status(200).send("Category has been successfully deleted");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error deleting your category");
    });
});

// POST NEW CATEGORIE
app.post("/categories", function (req, res) {
  const { name } = req.body[0];
  connection
    .promise()
    .query("INSERT INTO categories (name) VALUES (?)", [name])
    .then(() => {
      res.status(201).send({
        name,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error creating your category");
    });
});

// GET ALL POSTS FROM ONE CATEGORY
app.get("/categories/:id/posts", function (req, res) {
  const { id } = req.params;
  connection
    .promise()
    .query(
      "SELECT * FROM posts p JOIN categories c WHERE p.category_id = c.id AND c.id = ?",
      [id]
    )
    .then(([results]) => {
      res.json(results);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error retrieving the posts from the database");
    });
});

//GET ONE POST
app.get("/posts/:id", function (req, res) {
  const { id } = req.params;
  connection
    .promise()
    .query("SELECT * FROM posts p WHERE p.id = ?", [id])
    .then(([results]) => {
      res.json(results);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error retrieving the post from the database");
    });
});

// POST ONE POST
app.post("/posts", function (req, res) {
  const { title, content, category } = req.body[0];
  connection
    .promise()
    .query("INSERT INTO posts (title, content, category_id) VALUES (?, ?, ?)", [
      title,
      content,
      category,
    ])
    .then(([result]) => {
      const id = result.insertId;
      res.status(201).send({
        id,
        title,
        content,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error posting your post");
    });
});

// UPDATE ONE POST
app.put("/posts/:id", (req, res) => {
  const { id } = req.params;
  const { title, content, category } = req.body[0];
  console.log(title, content, category);
  connection
    .promise()
    .query(
      `UPDATE posts SET title=?, content=?, category_id=? WHERE posts.id = ?`,
      [title, content, category, id]
    )
    .then(() => {
      res.status(201).send({
        id,
        title,
        content,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error updating your post");
    });
});

// DELETE ONE POST
app.delete("/posts/:id", function (req, res) {
  const { id } = req.params;
  connection
    .promise()
    .query("DELETE FROM posts p WHERE p.id = ?", [id])
    .then(() => {
      res.status(200).send("Post has been successfully deleted");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error deleting your post");
    });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

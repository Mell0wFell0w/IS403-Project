//Matthew Cooper, Kelsey Corfield, Lorin Costley, Alec Peal
//Section 1
//This is our website to manage a database of tenant information for Wymount Community Aides

const express = require("express");

let app = express();

let path = require("path");

const users = [{ username: "admin", password: "pass123" }];

const port = process.env.PORT || 3000;

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

// this is a change

const knex = require("knex")({
  client: "pg",
  connection: {
    host: process.env.RDS_HOSTNAME || "localhost",
    user: process.env.RDS_USERNAME || "postgres",
    password: process.env.RDS_PASSWORD || "Aliese0921",
    database: process.env.RDS_BD_NAME || "ebdb",
    port: process.env.RDS_PORT || 5432,
    ssl: process.env.DB_SSL ? { rejectUnauthorized: false } : false,
  },
});

app.use(express.static("public"));

//home path
app.get("/", (req, res) => {
  // to test if ejs is working
  const name = "John";
  res.render("home", { name });
});

app.get("/login", (req, res) => {
  res.render("login", { error: null });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Simple array check for username and password
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    // Render the admin_data view with the fetched data
    res.render("/admin");
  } else {
    res.render("login", { error: "Invalid username or password" });
  }
});

//listen on the port specified above
app.listen(port, () => {
    console.log('Server is listening')
});
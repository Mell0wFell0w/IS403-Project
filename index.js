//Matthew Cooper, Kelsey Corfield, Lorin Costley, Alec Peal
//Section 1
//This is our website to manage a database of tenant information for Wymount Community Aides

const express = require('express');

let app = express();

let path = require('path');

const users = [
    { username: 'admin', password: 'pass123' }
];

const port = 3000;

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use( express.urlencoded( {extended: true}) );

const knex = require('knex')({
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'postgres',
        password: 'Aliese0921',
        database: 'tenants',
        port: 1221
    }
});

app.get('/', (req, res) => {
    res.render('home', { error:null })
});

app.get('/login', (req, res) => {
    res.render('login', { error:null })
});

app.get('/admin', (req, res) => {
    knex.select().from('tenants').then( tenants => {
        res.render('admin', { tenants : tenants});
    })
})

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Simple array check for username and password
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Render the admin_data view with the fetched data
        knex.select().from('tenants').then( tenants => {
            res.render('admin', { tenants : tenants});
        })
    } else {
    res.render('login', { error: 'Invalid username or password' });
}
}); 

app.get("/addTenant", (req, res) => {
    res.render("addTenant");
 })
 app.post("/addTenant", (req, res)=> {
    knex("tenants").insert({
        Apartment: req.body.Apartment.toUpperCase(),
        FName: req.body.FName.toUpperCase(),
        LName: req.body.LName.toUpperCase(),
        Spouse_FName: req.body.Spouse_FName.toUpperCase(),
        Spouse_LName: req.body.Spouse_LName.toUpperCase(),
   }).then(tenants => {
      res.redirect("admin");
   })
 });

app.get("/editTenant/:Apartment", (req, res)=> {
    knex.select("Apartment",
                    "FName", 
                    "LName", 
                    'Spouse_FName', 
                    'Spouse_LName').from("tenants").where("Apartment", req.params.Apartment).then(tenants => {
    res.render("editTenant", {tenants: tenants});
   }).catch( err => {
      console.log(err);
      res.status(500).json({err});
   });
 });

 app.post("/editTenant", (req, res)=> {
    knex("tenants").where("Apartment", parseInt(req.body.apartment)).update({
      Apartment: req.body.Apartment.toUpperCase(),
      FName: req.body.FName.toUpperCase(),
      LName: req.body.LName.toUpperCase(),
      Spouse_FName: req.body.Spouse_FName.toUpperCase(),
      Spouse_LName: req.body.Spouse_LName.toUpperCase(),
   }).then(tenants => {
      res.redirect("admin");
   })
 });

 app.post("/deleteTenant/:Apartment", (req, res) => {
    const { Apartment } = req.params;
  
    knex("tenants")
      .where("Apartment", Apartment)
      .del()
      .then(() => {
        // Redirect upon successful deletion
        res.redirect("/admin");
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "Error deleting tenant" });
      });
  });

app.listen(3000, () => console.log('Server is running'));

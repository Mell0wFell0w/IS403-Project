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
    knex.select().from('tenants').then( country => {
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

// app.get("/editTenant/:id", (req, res)=> {
//     knex.select("Apartment",
//                     "FName", 
//                     "LName", 
//                     'Spouse_FName', 
//                     'Spouse_LName', 
//                     'PhoneNum', 
//                     'Spouse_PhoneNum', 
//                     'Email', 
//                     'Spouse_Email').from("tenants").where("Apartment", req.params.apartment).then(tenants => {
//     res.render("editTenant", {tenants: tenants});
//    }).catch( err => {
//       console.log(err);
//       res.status(500).json({err});
//    });
//  });

//  app.post("/editTenant", (req, res)=> {
//     knex("country").where("country_id", parseInt(req.body.country_id)).update({
//       country_name: req.body.country_name.toUpperCase(),
//       popular_site: req.body.popular_site.toUpperCase(),
//       capital: req.body.capital.toUpperCase(),
//       population: req.body.population,
//       visited: req.body.visited ? "Y" : "N",
//       covid_level: req.body.covid_level.toUpperCase()
//    }).then(mycountry => {
//       res.redirect("/");
//    })
//  });

//  app.post("/deleteCountry/:id", (req, res) => {
//     knex("country").where("country_id",req.params.id).del().then( mycountry => {
//       res.redirect("/");
//    }).catch( err => {
//       console.log(err);
//       res.status(500).json({err});
//    });
//  });

app.listen(3000, () => console.log('Server is running'));

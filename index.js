// npm install * --save
const express = require("express");   // Express framework for handling HTTP requests
const mysql2 = require("mysql2");      // MySQL database driver
const cors = require("cors");         // CORS middleware for handling cross-origin resource sharing
const path = require("path");         // Path module for working with file and directory paths

// Importing MySQL password from external file (.gitignore)
const password = require('./password');

// Initializing Express application
const app = express();
const PORT = 8080;

// Middleware setup
app.use(express.json());
app.use(cors()); // Enable CORS to avoid network security restrictions

// Creating a MySQL connection to studie_cafe db
const db = mysql2.createConnection({
    host:"localhost",
    user:"root",
    password: password,
    database:"studie_cafe"
});

// All files within the public folder will be served automatically
// when you access the root path http://localhost:8080/
// For details, refer to: https://expressjs.com/en/starter/static-files.html
app.use(express.static(path.join(__dirname, 'public')));

// Checking connect to the database
db.connect(error => {
    if (error) {
        console.error('Database connection error:', error);
    } else {
        console.log('Connected to the database');
    }
});

/**************************************************/
/**************** CAFE END-POINTS *****************/
/**************************************************/

// Endpoint to get all cafes (NOT IN USE)
app.get('/cafe/:id', (req, res) => {
    const cafe_id = req.params.id;
    const query = 'SELECT * FROM cafes WHERE cafe_id = ?';

    // Executing the query
    db.query(query, cafe_id, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(results);
        }
    });
});


// Endpoint to get any cafe through the id  (IN USE)
app.get('/cafe', (req, res) => {

    const noiseLevel = req.query.noiseLevel;
    const priceLevel = req.query.priceLevel;
    const wifiAvailable = req.query.wifiAvailable;
    const foodAvailable = req.query.foodAvailable;
    const locationArea = req.query.locationArea;
    const favoritesFilter = req.query.favoritesFilter;
    const userId = req.query.userId;

    let whereFilter = undefined;
    let filters = []

    if (noiseLevel) {
        filters.push("noise_level = '" + noiseLevel + "'");
    }

    if (priceLevel) {
        filters.push("price_level = '" + priceLevel + "'");
    }

    if (wifiAvailable) {
        filters.push("available_wifi = ".concat('yes' === wifiAvailable));
    }

    if(foodAvailable) {
        filters.push("offer_food = ".concat('yes' === foodAvailable));
    }

    if (locationArea) {
            filters.push("area.area = '" + locationArea + "'");
    }

    // TODO: favorites filter...
    let favoritesJoin = 'LEFT OUTER ';
    if(favoritesFilter && favoritesFilter === 'yes') {
        favoritesJoin = 'INNER ';
        filters.push("favorites.user_id =" + userId);
    }

    if (filters.length > 0) {
        filters.forEach(f => {
            if (whereFilter)
                whereFilter = whereFilter.concat(' and ').concat(f);
            else
                whereFilter = 'where ' + f;
        });
    } else {
        whereFilter = '';
    }

    const query =
        "SELECT cafes.*, area.area as area, COUNT(favorites.cafe_id) as favorite_count FROM cafes " +
        "LEFT OUTER JOIN area ON cafes.area_id = area.area_id " +
        favoritesJoin + "JOIN favorites ON cafes.cafe_id = favorites.cafe_id " +
        whereFilter +
        " GROUP BY cafes.cafe_id " +
        "ORDER BY cafes.cafe_id" ;

    console.log(query)    ;

    db.query(query, (error, result) => {
        if (error) {
            console.error('Error finding cafe:', error);
            res.status(500).send('Internal Server Error ' +  error);
        } else {
            res.status(200).send(result);
        }
    });
});


// Endpoint to get area and area_id by inner joining table cafes and table area (NOT IN USE)
app.get('/cafe/:area', (req, res) => {
    const area = parseInt(req.params.areas);
    const query = 'SELECT area.area_id, area.area FROM cafes JOIN area ON cafes.area_id = area.area_id GROUP BY area.area_id ORDER BY area.area_id';

    db.query(query, [area], (error, result) => {
        if (error) {
            console.error('Error finding noise_level:', error);
            res.status(500).send('Internal Server Error ' +  error);
        } else {
            res.status(200).send(result);
        }
    });
});


/**************************************************/
/**************** USER END-POINTS *****************/
/**************************************************/

// Endpoint to create a new user
app.post('/users/new', (req, res) => {
    // Extracting username, email, birthdate and password from the request body
    const username = req.body.username;
    const email = req.body.email;
    const birthDate = req.body.birthDate;
    const password = req.body.password;

    // Checking if the username or email already exists
    db.query('SELECT user_id FROM users WHERE username = ? OR email = ?',
        [username, email],
        (error, results) => {
            if (results.length > 0) {
                res.status(403).send('Username OR email already exists');
            } else {
                // Inserting a new user into the database
                db.query('INSERT INTO users (username, email, date_of_birth, `password`) VALUES (?, ?, ?, ?)',
                    [username, email, birthDate, password],
                    (error, results) => {
                        if (error) {
                            console.error('Error inserting user:', error);
                            res.status(500).send('Internal Server Error ' +  error);
                        } else {
                            res.status(200).send(results);
                        }
                    });
            }
        });
});


// Endpoint to log in user by email or username (and password)
// Use POST and not GET, to not expose user password in URL.
app.post('/users/login', (req, res) => {
    // Extracting username and password from the request body
    const usernameOrEmail = req.body.usernameOrEmail;
    const password = req.body.password;

    // Check if the user exists by username or email
    const query = 'SELECT user_id FROM users WHERE username = ? OR email = ?';
    db.query(query, [usernameOrEmail, usernameOrEmail], (error, results) => {
        if (results.length > 0) {

            // Check if password is correct
            const queryPasswordCheck = 'SELECT user_id, username, email, phone_number, postalcode, date_of_birth FROM users WHERE (username = ? OR email = ?) AND `password` = ?';
            db.query(queryPasswordCheck, [usernameOrEmail, usernameOrEmail, password], (error, results) => {
                if (error) {
                    console.error('Error logging in user:', error);
                    res.status(500).send('Internal Server Error ' +  error);
                    return;
                }

                if (results.length > 0) {
                    res.status(200).send(results[0]);
                } else {
                    res.status(401).send('Incorrect password');
                }

            });
        } else {
            res.status(401).send('Username OR email does not exists');
        }

    });
});


// Endpoint to get any user email through the user id (NOT IN USE)
app.get('/email/:id', (req, res) => {
    const user_id = req.params.id;
    const query = 'SELECT email FROM users WHERE user_id = ?';

    db.query(query, [user_id], (error, result) => {
        if (error) {
            console.error('Error finding email by user_id:', error);
            res.status(500).send('Internal Server Error ' +  error);
        } else {
            res.status(200).send(result);
        }
    });
});


// Endpoint that can display the username by the phone number af parameter (NOT IN USE)
app.get('/nameByNumber/:number', (req, res) => {
    const userPhoneNumberRequest = req.params.number;

    db.query('SELECT username FROM users WHERE `phone_number` = ?',
        [userPhoneNumberRequest],
        (error, result) => {
            if (error) {
                console.error(error);
                res.status(500).send("Internal Server Error");
            } else {
                if (result.length === 0) {
                    res.status(404).send("User not found");
                } else {
                    res.send(result);
                }
            }
        });
});


/********************************************************/
/**************** FAVORITES END-POINTS *****************/
/******************************************************/

// Endpoint that inserts / register a cafe_id as a favorite for a given user_id
app.post('/favorites/new', (req, res) => {
    const cafeId = req.body.cafeId;
    const userId = req.body.userId;

    db.query('INSERT INTO favorites (cafe_id, user_id) VALUES (?, ?)',
        [cafeId, userId],
        (error) => {
            if (error) {
                console.error('Error inserting favorite:', error);
                res.status(500).send('Internal Server Error ' +  error);
            } else {
                db.query('SELECT count(*) AS count_all FROM favorites WHERE cafe_id = ?',
                    [cafeId],
                    (error, results) => {
                        if (error) {
                            console.error('Error selecting favorite count:', error);
                            res.status(500).send('Internal Server Error ' +  error);
                        } else {
                            res.status(200).send(results);
                        }
                    });
            }
        });
});


// Endpoints that deletes the favorite (like) when cafe_id and user_id is known
app.post('/favorites/delete', (req, res) => {
    const cafeId = req.body.cafeId;
    const userId = req.body.userId;

    db.query('DELETE FROM favorites WHERE cafe_id = ? AND user_id = ?',
        [cafeId, userId],
        (error) => {
            if (error) {
                console.error('Error deleting favorite:', error);
                res.status(500).send('Internal Server Error ' +  error);
            } else {
                db.query('SELECT count(*) AS count_all FROM favorites WHERE cafe_id = ?',
                    [cafeId],
                    (error, results) => {
                        if (error) {
                            console.error('Error selecting favorite count:', error);
                            res.status(500).send('Internal Server Error ' +  error);
                        } else {
                            res.status(200).send(results);
                        }
                    });
            }
        });
});


// Endpoint that returns favorites by cafe id that the user id has liked  ( IN USE )
app.get('/cafeFavorites/:userId', (req, res) => {
    const userId = req.params.userId;

    db.query('SELECT cafe_id FROM favorites WHERE user_id = ?',
        [userId],
        (error, result) => {
            if (error) {
                console.error(error);
                res.status(500).send("Internal Server Error");
            } else {
                res.send(result);
            }
        });
});


// Default route to handle 404 errors for unmatched API endpoints (NOT IN USE)
app.get('*',(req,res) =>{
    res.sendStatus(404);
});


// Starting the Express server on the specified port (8080)
app.listen(PORT, () => {
        console.log(`it's alive on http://localhost:${PORT}`)
    }
); // setting up a responsive api, with a message in the terminal.

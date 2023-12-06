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

// Endpoint to get all cafes
app.get('/cafes', (req, res) => {
    const query = 'SELECT * FROM cafes';

    // Executing the query
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(results);
        }
    });
});

// Endpoint to get any cafe through the id
app.get('/cafe/:id', (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM cafes WHERE cafe_id = ?';

    db.query(query, [id], (error, result) => {
        if (error) {
            console.error('Error finding cafe:', error);
            res.status(500).send('Internal Server Error ' +  error);
        } else {
            res.status(200).send(result);
        }
    });
});


// Endpoint to get any cafe with a noise level lower than the one requested.
app.get('/noise/:number', (req, res) => {
    const noiseNumber = parseInt(req.params.number);
    const query = 'SELECT * FROM cafes WHERE noise_level < ?';

    db.query(query, [noiseNumber], (error, result) => {
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
    // Extracting username, email, birtdate and password from the request body
    const username = req.body.username;
    const email = req.body.email;
    const birthDate = req.body.birthDate;
    const password = req.body.password;

    // Checking if the username or email already exists
    db.query('SELECT username, email FROM users WHERE username = ? OR email = ?',
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
    const query = 'SELECT username FROM users WHERE username = ? OR email = ?';
    db.query(query, [usernameOrEmail, usernameOrEmail], (error, results) => {
        if (results.length > 0) {

            // Check if password is correct
            const queryPasswordCheck = 'SELECT username FROM users WHERE (username = ? OR email = ?) AND `password` = ?';
            db.query(queryPasswordCheck, [usernameOrEmail, usernameOrEmail, password], (error, results) => {
                if (error) {
                    console.error('Error logging in user:', error);
                    res.status(500).send('Internal Server Error ' +  error);
                    return;
                }

                if (results.length > 0) {
                    res.status(200).send('Login successful');
                } else {
                    res.status(401).send('Incorrect password');
                }

            });
        } else {
            res.status(401).send('Username OR email does not exists');
        }

    });
});


// Endpoint to get any user email through the user id
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

// Endpoint that can display the username by the phone number af parameter
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


// Endpoint to get all favorite id with an assigned user id as parameter
app.get('/favorites/:id', (req, res) => {
    const userId = req.params.id;
    const query = 'SELECT * FROM favorites WHERE `user_id` = ?';

    // Executing the query
    db.query(query, [userId], (error, result) => {
        res.send(result);
    });
});


// Endpoint that counts how many times a cafe have benn marked as favorite and takes the cafe id as parameter
app.get('/cafeFavoritesCount/:cafeId', (req, res) => {
    const cafeId = req.params.cafeId;

    db.query('SELECT COUNT(*) AS favoriteCount FROM favorites WHERE cafe_id = ?',
        [cafeId],
        (error, result) => {
            if (error) {
                console.error(error);
                res.status(500).send("Internal Server Error");
            } else {
                const favoriteCount = result[0].favoriteCount;
                res.send({ cafeId, favoriteCount });
            }
        });
});

// Default route to handle 404 errors for unmatched API endpoints
app.get('*',(req,res) =>{
    res.sendStatus(404);
});

// Starting the Express server on the specified port (8080)
app.listen(PORT, () => {
    console.log(`it's alive on http://localhost:${PORT}`)
    }
); // setting up a responsive api, with a message in the terminal.




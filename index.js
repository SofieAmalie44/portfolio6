const express = require('express');
const mysql2 = require('mysql2');

const app = express(); // applying middleware to assure it runs every endpoint callback that are defined (json)
const PORT = 8080;

app.use( express.json() ); // ensuring that express.json middleware is running (converting body to json)

app.listen(
    PORT,
    () => console.log(`it's alive on http://localhost:${PORT}`)
) // setting up a responsive api, with a message in the terminal.


const db = mysql2.createConnection({
    host:"localhost",
    user:"root",
    password:"MyNewPass",
    database:"myDB"
});

// Checking connect to the database
db.connect(err => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to the database');
    }
});


// Endpoint to get all cafes
app.get('/cafes', (req, res) => {
    const query = 'SELECT * FROM cafes';

    // Executing the query
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(results);
        }
    });
});


// Endpoint to get any cafe through the id
app.post('/cafe/:id', (req, res) => {
    const {id} = req.params;
    const query = 'SELECT * FROM cafes WHERE cafe_id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (result.length > 0) {
                res.send({
                    cafe: result[0],
                });
            } else {
                res.status(404).json({ error: 'Cafe not found' });
            }
        }
    });
});


// Endpoint to get any cafe with a noise level lower than the one requested.
app.post('/noise/:number', (req, res) => {
    const noiseNumber = req.params.number;
    const query = 'SELECT * FROM cafes WHERE `noice_level` < ?';

    db.query(query, [noiseNumber], (error, result) => {
        res.send(result);
    });
});


// Endpoint to get any user email through the user id
app.get('/email/:id',(req, res)=>{
    const emailByID = req.params.id;
    const query = 'SELECT `email` FROM users WHERE `user_id` = ?';

        db.query(query, [emailByID], (error, result) => {
            res.send(result);
        });
});


// Endpoint that can get all the usernames that has an age higher than the average age as parameter
app.get('/averageAge/:number', (req, res) => {
    const ageAVG = req.params.number;
    const query = `SELECT username, AVG(age) as average_age FROM users GROUP BY username HAVING AVG(age) > ?`;

    db.query(query, [ageAVG], (error, result) => {
        res.send(result);
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


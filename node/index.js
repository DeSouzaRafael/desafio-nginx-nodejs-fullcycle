const express = require('express')
const app = express()
const port = 3000
const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'desafiodb',
};
const mysql = require('mysql')
const connection = mysql.createConnection(config)

function insertName(name, callback) {
    const checkExist = 'SELECT name FROM people WHERE name = ?';
    connection.query(checkExist, [name], (error, results) => {
        if (error) {
            callback(error);
        } else {
            if (results.length === 0) {
                const insertQuery = 'INSERT INTO people (name) VALUES (?)';
                connection.query(insertQuery, [name], (error, results) => {
                    if (error) {
                        callback(error);
                    } else {
                        callback(null, results);
                    }
                });
            } else {
                callback(null, results);
            }
        }
    });
}

function selectNames() {
    return new Promise((resolve, reject) => {
        const selectQuery = `SELECT name FROM people`;
        connection.query(selectQuery, (error, results) => {
            if (error) {
                reject(error);
            } else {
                const names = results.map((result) => result.name);
                resolve(names);
            }
        });
    });
}

function listAndInsertNames(name) {
    return new Promise((resolve, reject) => {
        if (name !== undefined && name !== null) {
            insertName(name, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        } else {
            insertName('Rafael', (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        }
    });
}

app.get('/:name?', (req, res) => {
    const name = req.params.name;

    listAndInsertNames(name)
        .then(() => {
            return selectNames();
        })
        .then((names) => {
            const html = `
        <!DOCTYPE html>
        <html>
        <head>
        <style>
        body {
            display: flex;
            flex-direction: column;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        </style>
        </head>
        <body>
        <h1>Full Cycle Rocks!!!</h1>
        <ul>
        ${names.map(name => `<li>${name}</li>`).join('')}
            </ul>
            </body>
            </html>
            `;

            res.send(html);
        })
        .catch((err) => {
            res.status(500).send('Erro ao processar a solicitacao');
        });
});

app.listen(port, () => {
    console.log('Start Port: ' + port)
})
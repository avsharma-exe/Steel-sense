const mysql = require('mysql')

import mig_db from './database/mig_db'

// declaring database connection
const db = mysql.createPool(mig_db.hosted)

db.connect();

// execute query function
export default async function executeQuery({ query, values }) {
    return new Promise((resolve, reject) => {
        db.query(query, values, (error, rows, fields) => {
            if (error) {
                reject(error);
            } 
            // console.log(rows);
            resolve(rows);
            db.end();
        })
    });
}

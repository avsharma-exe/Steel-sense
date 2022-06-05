const mysql = require('mysql');

import mig_db from './database/mig_db'

// declaring database connection
const db = mysql.createConnection(mig_db.hosted)

db.connect();

// execute query function
export default async function executeQuery({ query, values }) {
    try {
        const results = await db.query(query, values);
        
        return results;
    } catch (error) {
        // console.log(error)

        return { error };
    }
}
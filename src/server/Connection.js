// const mysql = require('mysql')
import mysql from 'serverless-mysql'

import mig_db from './database/mig_db'

// declaring database connection
// const db = mysql.createPool(mig_db.hosted)

// db.connect();

// execute query function
// export default async function executeQuery({ query, values }) {
//     return new Promise((resolve, reject) => {
//         console.log(query)
//         db.query(query, values, (error, rows, fields) => {
//             if (error) {
//                 reject(error);
//             }
//             // console.log(rows);
//             resolve(rows);
//             db.end();
//         })
//     });
// }

const db = mysql({
  config: mig_db.hosted
})

export default async function executeQuery({ query, values }) {
  try {
    const results = await db.query(query, values)
    await db.end()
    return results
  } catch (error) {
    return { error }
  }
}

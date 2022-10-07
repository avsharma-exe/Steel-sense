// const mysql = require('mysql')
import mysql from 'serverless-mysql'

import mig_db from './database/mig_db'

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

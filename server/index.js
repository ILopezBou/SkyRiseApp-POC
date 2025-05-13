const express = require('express');
const cors    = require('cors');
const sql     = require('mssql');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: { encrypt: true }
};

sql.connect(dbConfig)
  .then(pool => {
    console.log('✓ Connected to Azure SQL');
    app.locals.db = pool;

    app.get('/api/helicopters', async (req, res) => {
      const result = await pool.request().query('SELECT * FROM Helicopters');
      res.json(result.recordset);
    });

    app.listen(process.env.PORT, () =>
      console.log(`API running on http://localhost:${process.env.PORT}`)
    );
  })
  .catch(err => console.error('❌ DB Connection Failed:', err));

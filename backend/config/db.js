import sql from 'mssql/msnodesqlv8.js';

const config = {
connectionString: 'Driver={ODBC Driver 18 for SQL Server};Server=DESKTOP-EFLTMJ8;Database=Health;Trusted_Connection=Yes;TrustServerCertificate=Yes;'
};

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

poolConnect.then(() => {
  console.log('✅ Connected to SQL Server with Windows Authentication');
}).catch(err => {
  console.error('❌ Connection error:', err);
});

export { sql, pool, poolConnect };




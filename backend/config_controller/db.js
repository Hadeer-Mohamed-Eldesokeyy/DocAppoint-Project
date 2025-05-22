import sql  from 'mssql';

/// this file is for connecting the database to the codes
///just let it be dont adjust pls

const config = {
  server: 'DESKTOP-A5GLPKH',
  database: 'Health',
  options: {
    trustedConnection: false,   // Set to false to use SQL authentication
    trustServerCertificate: true,
  },
  authentication: {
    type: 'default',            // Use default authentication
    options: {
      userName: 'hadeer_mohamed', // Your new SQL user
      password: 'hodm42004',  // Replace with your new SQL user's password
    }
  }
};
  
  // Function to connect to the database
export const connectToDatabase = async () => {
    try {
      await sql.connect(config);
      console.log('Connected to SQL Server');
    } catch (err) {
      console.error('Connection error:', err);
      // More detailed error logging
      if (err.code) {
        console.error(`Error Code: ${err.code}`);
      }
      if (err.message) {
        console.error(`Error Message: ${err.message}`);
      }
    }
  }
  
  // Try connecting to the database as soon as the server starts
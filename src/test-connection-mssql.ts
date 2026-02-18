import sql from 'mssql';
import { EnvAdapter } from './config/plugins';

const config = {
    user: EnvAdapter.MSSQL_USER,
    password: EnvAdapter.MSSQL_PASSWORD,
    server: EnvAdapter.MSSQL_SERVER,  
    database: EnvAdapter.MSSQL_NAME,
    port: EnvAdapter.MSSQL_PORT,
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

async function testConnection() {
    try {
        console.log("🔄 Conectando...");
        const pool = await sql.connect(config);
        console.log("✅ ¡Conexión exitosa!");

        const result = await pool.request().query(`
            SELECT DB_NAME() as DB, SYSTEM_USER as Usuario
        `);
        console.log("📊", result.recordset[0]);

        await pool.close();
    } catch (err: any) {
      console.log(err)
        console.error("❌ Error:", err.message);
    }
}

testConnection();
import sql, { ConnectionPool, config as SqlConfig } from "mssql";
import { EnvAdapter } from "../../../config/plugins";

export class MssqlClient {

    private static pool: ConnectionPool | null = null

    private static config: SqlConfig = {
        server: EnvAdapter.MSSQL_SERVER,
        user: EnvAdapter.MSSQL_USER,
        password: EnvAdapter.MSSQL_PASSWORD,
        database: EnvAdapter.MSSQL_NAME,
        port: EnvAdapter.MSSQL_PORT,
        options: {
            encrypt: false,
            trustServerCertificate: true
        }, 
        pool: {
            max: 10,
            min: 0,
            idleTimeoutMillis: 3000
        }
    }

    public static async getConnection(): Promise<ConnectionPool> {
        if ( !this.pool ) {
            this.pool = await sql.connect(this.config)
            console.log(`MSSQL - ${MssqlClient.config.database} conectada`)
        }
        return this.pool
    }

    public static async disconnect(): Promise<void> {
        if ( this.pool ) {
            await this.pool.close()
            this.pool = null
            console.log('MSSQL desconectado')
        }
    }

}
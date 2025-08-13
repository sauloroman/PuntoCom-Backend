import 'dotenv/config'
import * as env from 'env-var'

export class EnvAdapter {

  public static PORT: number = env.get('PORT').required().asPortNumber()
  
  public static POSTGRESDB_USER: string = env.get('POSTGRESDB_USER').required().asString()
  public static POSTGRESDB_PASSWORD: string = env.get('POSTGRESDB_PASSWORD').required().asString()
  public static POSTGRESDB_NAME: string = env.get('POSTGRESDB_NAME').required().asString()
  public static POSTGRES_URL: string = env.get('POSTGRES_URL').required().asUrlString()

  public static FRONTEND_URL: string = env.get('FRONTEND_URL').required().asString()
}
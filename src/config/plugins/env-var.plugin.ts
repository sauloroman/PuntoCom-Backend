import 'dotenv/config'
import * as env from 'env-var'

export class EnvAdapter {

  public static PORT: number = env.get('PORT').required().asPortNumber()
  
  public static POSTGRESDB_USER: string = env.get('POSTGRESDB_USER').required().asString()
  public static POSTGRESDB_PASSWORD: string = env.get('POSTGRESDB_PASSWORD').required().asString()
  public static POSTGRESDB_NAME: string = env.get('POSTGRESDB_NAME').required().asString()
  public static POSTGRES_URL: string = env.get('POSTGRES_URL').required().asUrlString()

  public static JWT_SEED: string = env.get('JWT_SEED').required().asString()

  public static FRONTEND_URL: string = env.get('FRONTEND_URL').required().asString()

  public static MAILER_SERVICE: string = env.get('MAILER_SERVICE').required().asString()
  public static MAILER_EMAIL: string = env.get('MAILER_EMAIL').required().asEmailString()
  public static SEND_EMAIL: boolean = env.get('SEND_EMAIL').required().asBool()
  public static MAILER_SECRET_KEY: string = env.get('MAILER_SECRET_KEY').required().asString()

  public static CLOUDINARY_URL: string = env.get('CLOUDINARY_URL').required().asString()

}
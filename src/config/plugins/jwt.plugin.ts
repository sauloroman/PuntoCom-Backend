import { EnvAdapter } from './env-var.plugin';
import jwt from 'jsonwebtoken'

const JWT_SEED = EnvAdapter.JWT_SEED

export class JwtAdapter {

  public static generateJWT = async ( payload: any ) => new Promise(( res ) => {
    
    jwt.sign( payload, JWT_SEED, { expiresIn: '3h' }, ( err, token ) => {
      if ( err ) return res( null )
      res( token )
    })

  })

  public static validateToken = async <T>( token: string ): Promise<T | null> => new Promise( res => {

    jwt.verify( token, JWT_SEED, ( err, decode ) => {
      if ( err ) return res( null )
      res( decode as T )
    })

  })

} 
import { compareSync, genSaltSync, hashSync } from 'bcryptjs'

export class BcryptAdapter {

  public static hash ( password: string ) {
    const salt = genSaltSync()
    return hashSync(password, salt)
  }

  public static compare ( password: string, hashPassword: string ): boolean {
    return compareSync( password, hashPassword )
  }
}
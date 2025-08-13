import { v4 as uuidv4 } from 'uuid'

export class IDAdapter {
  
  public static generate() {
    return uuidv4()
  }

}
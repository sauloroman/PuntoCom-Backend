import { Application } from 'express';

interface ServerOptions {
  app: Application,
  port: number
}

export class Server {

  private readonly port: number;
  private readonly app: Application;
  private serverListener?: any;

  constructor({ app, port }: ServerOptions) {
    this.app = app
    this.port = port
  }

  public async start() {
    this.serverListener = this.app.listen( this.port, () => {
      console.log(`Server running on port ${this.port}`)
    })
  }
  
  public close() {
    this.serverListener?.close()
  }

}
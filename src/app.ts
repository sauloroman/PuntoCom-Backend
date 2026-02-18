import { EnvAdapter } from './config/plugins';
import { Container } from './container';
import { Server, ServerConfiguration } from "./presentation/server"

(async () => {
  await main()
})()

async function main() {

  const configMSSQL = {
    user: 'ROMANTANK98',
    password: '',
    server: 'localhost',
    database: 'PuntoComDB',
    port: 1433,
    options: {
      encrypt: false,
      trustServerCertificate: true
    }
  };


  const dependencyInjection = new Container()

  const config = new ServerConfiguration({
    router: dependencyInjection.appRoutes.routes,
    publicPath: 'public'
  })

  const server = new Server({
    app: config.application,
    port: EnvAdapter.PORT
  })

  await server.start()

}
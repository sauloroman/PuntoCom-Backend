import { EnvAdapter } from './config/plugins';
import { Container } from './container';
import { Server, ServerConfiguration } from "./presentation/server"

(async () => {
  await main()
})()

async function main() {

  const dependencyInjection = await Container.create()

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
import { EnvAdapter } from './config/plugins/env-var.plugin';
import { Container } from './container/container';

import { ServerConfiguration } from "./presentation/server/server-configuration"
import { Server } from "./presentation/server/server";

(async () => {
  await main()
})()

async function main() {

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
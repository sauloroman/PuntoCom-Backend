import { AppRoutes } from '../presentation/routes/app.routes';
import { UserContainer } from './user.container';

export class Container {

  public readonly appRoutes: AppRoutes;

  constructor() {

    const userContainer = new UserContainer()

    this.appRoutes = new AppRoutes({
      userRoutes: userContainer.userRoutes
    })

  }

}
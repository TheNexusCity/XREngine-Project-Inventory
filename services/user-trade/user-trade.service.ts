import { Application } from '@xrengine/server-core/declarations'
import { UserTrade } from './user-trade.class'
import createModel from './user-trade.model'
import hooks from './user-trade.hooks'
import userTradeDocs from './user-trade.docs'

declare module '@xrengine/common/declarations' {
  interface ServiceTypes {
    'user-trade': UserTrade
  }
}

export default (app: Application): any => {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    multi: true
  }

  const event = new UserTrade(options, app)
  event.docs = userTradeDocs
  app.use('user-trade', event)

  const service = app.service('user-trade')

  service.hooks(hooks)
}

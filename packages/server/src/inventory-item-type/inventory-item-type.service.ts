import { Application } from '@xrengine/server-core/declarations'
import { InventoryItemType } from './inventory-item-type.class'
import createModel from './inventory-item-type.model'
import hooks from './inventory-item-type.hooks'

declare module '@xrengine/common/declarations' {
  interface ServiceTypes {
    'inventory-item-type': InventoryItemType
  }
}

export default (app: Application): any => {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    multi: true
  }

  /**
   * Initialize our service with any options it requires and docs
   *
   * @author DRC
   */
  const event = new InventoryItemType(options, app)
  app.use('inventory-item-type', event)

  const service = app.service('inventory-item-type')

  service.hooks(hooks)
}

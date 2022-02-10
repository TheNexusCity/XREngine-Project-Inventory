import { Application } from '@xrengine/server-core/declarations'
import { Service, SequelizeServiceOptions } from 'feathers-sequelize'

/**
 * A class for Collection type service
 *
 * @author Vyacheslav Solovjov
 */
export class InventoryItemType extends Service {
  public docs: any
  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options)
  }
}

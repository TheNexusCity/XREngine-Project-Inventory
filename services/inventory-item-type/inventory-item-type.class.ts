import { Service, SequelizeServiceOptions } from 'feathers-sequelize'
import { Application } from '../../../declarations'

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

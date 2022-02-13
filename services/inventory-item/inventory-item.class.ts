import { Application } from '@xrengine/server-core/declarations'
import { Service, SequelizeServiceOptions } from 'feathers-sequelize'
import { Params } from '@feathersjs/feathers'

export class InventoryItem extends Service {
  app: Application
  docs: any

  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options)
    this.app = app
  }
  
  async find(params?: Params): Promise<any> {
    console.log(params?.query)
    params!.query!.$or = [
      {
        userId: params!.query!.userId
      }
    ]
    delete params!.query!.userId
    return super.find(params)
  }
}

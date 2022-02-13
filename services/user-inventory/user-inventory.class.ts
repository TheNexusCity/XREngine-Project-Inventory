import { Service, SequelizeServiceOptions } from 'feathers-sequelize'
import { Application } from '@xrengine/server-core/declarations'
import { NullableId, Params } from '@feathersjs/feathers'
import { blockchainTokenGenerator } from '../utils/blockchainTokenGenerator'
import { blockchainUserWalletSend } from '../utils/blockchainUserWalletSend'
import { UserInventoryInterface } from '../../interfaces/InventoryInterfaces'

export type UserInventoryDataType = UserInventoryInterface & { userId: string }

// TODO
export const transferBIAB = async (fromUserId: string, toUserId: string, quantity: number, walletAmt: number) => {
  let response: any = await blockchainTokenGenerator()
  const accessToken = response?.data?.accessToken
  const walletResponse = await blockchainUserWalletSend(fromUserId, toUserId, walletAmt, accessToken)
  return walletResponse
}

export class UserInventory<T = UserInventoryDataType> extends Service<T> {
  app: Application
  docs: any
  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options)
    this.app = app
  }

  // @ts-ignore
  async find(params: Params): Promise<{ data: UserInventoryDataType }> {
    const data = await super.find({ paginate: false })
    console.log(data)
    return { data } as any
  }

  // async patch(id: NullableId, data: any, params: Params) {
  //   if (data.type === 'transfer') {
  //     const { fromUserId, toUserId, quantity, walletAmt } = data
  //     transfer(fromUserId, toUserId, quantity, walletAmt)
  //   }
  //   const userInventoryId = id
  //   return await super.patch(userInventoryId, data)
  // }
}

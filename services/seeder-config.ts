import { inventoryItemTypeSeed } from './inventory-item-type/inventory-item-type.seed'
import { ServicesSeedConfig } from '@xrengine/common/src/interfaces/ServicesSeedConfig'
import { inventoryItemSeed } from './inventory-item/inventory-item.seed'

export const userSeeds: Array<ServicesSeedConfig> = [
  inventoryItemTypeSeed,
  inventoryItemSeed
]

export default userSeeds

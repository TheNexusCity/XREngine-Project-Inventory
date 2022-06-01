import { Application } from '@xrengine/server-core/declarations'
import InventoryItem from './inventory-item/inventory-item.service'
import UserInventory from './user-inventory/user-inventory.service'
import UserTrade from './user-trade/user-trade.service'
import InventoryItemType from './inventory-item-type/inventory-item-type.service'

export default (app: Application): void => {
[
InventoryItem,
UserInventory,
UserTrade,
InventoryItemType
].forEach((service) => {
  app.configure(service)
})
}
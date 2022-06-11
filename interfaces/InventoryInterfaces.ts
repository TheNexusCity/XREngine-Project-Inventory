export interface UserInventoryInterface {
  userInventoryId: string
  quantity: number
  addedOn: number
}

export interface InventoryItemInterface {
  inventoryItemId: string
  name: string
  description: string
  isCoin: Boolean
  version: number
  metadata: string
  url: string
}

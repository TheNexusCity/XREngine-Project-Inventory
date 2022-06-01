export interface UserInventoryInterface {
  userInventoryId: string
  quantity: number
  addedOn: number
}

export interface InventoryItemInterface {
  inventoryItemId: string
  name: string
  description: string
  version: number
  metadata: string
  url: string
}

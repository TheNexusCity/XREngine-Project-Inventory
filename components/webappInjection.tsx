import { HotbarMenu, UserMenuPanels } from "@xrengine/client-core/src/user/components/UserMenu"
import Inventory from "./Inventory"
import Trading from "./Trading"
import Wallet from "./Wallet"
import InventoryIcon from '@mui/icons-material/Inventory'

const InventoryPanels = {
  Inventory: 'Inventory',
  Trading: 'Trading',
  Wallet: 'Wallet',
}

UserMenuPanels.set(InventoryPanels.Inventory, Inventory)
UserMenuPanels.set(InventoryPanels.Trading, Trading)
UserMenuPanels.set(InventoryPanels.Wallet, Wallet)

HotbarMenu.set(InventoryPanels.Inventory, InventoryIcon)

export default () => null!
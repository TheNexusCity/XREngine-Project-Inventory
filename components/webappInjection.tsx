import { HotbarMenu, UserMenuPanels } from "@xrengine/client-core/src/user/components/UserMenu"
import Inventory from "./Inventory"
import Trading from "./Trading"
import Wallet from "./Wallet"
import Tradetest from "./Tradetest"
import InventoryIcon from '@mui/icons-material/Inventory'
import Inventory2Icon from '@mui/icons-material/Inventory2';

const InventoryPanels = {
  Inventory: 'Inventory',
  Trading: 'Trading',
  Wallet: 'Wallet',
  Tradetest: 'Tradetest'
}

UserMenuPanels.set(InventoryPanels.Inventory, Inventory)
UserMenuPanels.set(InventoryPanels.Trading, Trading)
UserMenuPanels.set(InventoryPanels.Wallet, Wallet)
UserMenuPanels.set(InventoryPanels.Tradetest, Tradetest)

HotbarMenu.set(InventoryPanels.Inventory, InventoryIcon)
HotbarMenu.set(InventoryPanels.Tradetest, Inventory2Icon)

export default () => null!
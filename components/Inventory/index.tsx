import { AuthService, useAuthState } from '@xrengine/client-core/src/user/services/AuthService'
import React, { useEffect, useState } from 'react'
import InventoryContent from './InventoryContent'
import styles from '@xrengine/client-core/src/user/components/UserMenu/UserMenu.module.scss'
import { InventoryService, useInventoryState } from '../services/InventoryService'

interface Props {
  changeActiveMenu?: any
  id: String
}

export const Inventory = (props: Props): any => {
  const inventoryState = useInventoryState()
  let { isLoading } = inventoryState.value
  const authState = useAuthState()

  useEffect(() => {
    AuthService.doLoginAuto(true)
  }, [])

  useEffect(() => {
    if (authState.isLoggedIn.value) {
      InventoryService.fetchInventoryList(authState.authUser.identityProvider.userId.value)
    }
  }, [authState.isLoggedIn.value])

  return (
    <div className={styles.menuPanel}>
      {isLoading ? (
        'Loading...'
      ) : (
        <InventoryContent
          id={props.id}
          changeActiveMenu={props.changeActiveMenu}
        />
      )}
    </div>
  )
}

export default Inventory

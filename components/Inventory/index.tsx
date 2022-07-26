import { AuthService, useAuthState } from '@xrengine/client-core/src/user/services/AuthService'
import React, { useEffect, useState } from 'react'
import InventoryContent from './InventoryContent'
import styles from '../style/ui.module.scss'
import { InventoryService, useInventoryState } from '../services/InventoryService'

interface Props {
  changeActiveMenu?: any
  id: String
}

export const Inventory = (props: Props): any => {
  const inventoryState = useInventoryState()
  
  let { data, user, type, isLoading, isLoadingtransfer, coinData } = inventoryState.value
  const authState = useAuthState()
  
  useEffect(() => {
    AuthService.doLoginAuto(true)
  }, [])
  
  useEffect(() => {
    if (authState.isLoggedIn.value) {
      InventoryService.fetchInventoryList(authState.authUser.identityProvider.userId.value)
    }
  }, [authState.isLoggedIn.value])
  
  console.log(authState.authUser.value);
  return (
    <div className={styles.menuPanel}>
      {isLoading ? (
        'Loading...'
      ) : (
        <InventoryContent
        data={data}
        coinData={coinData}
        user={user}
        id={props.id}
        type={type}
        changeActiveMenu={props.changeActiveMenu}
        InventoryService={InventoryService}
        isLoadingtransfer={isLoadingtransfer}
        />
      )}
    </div>
  )
}

export default Inventory

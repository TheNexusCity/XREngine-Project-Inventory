import React, { useEffect, useState } from 'react'

import { AuthService, useAuthState } from '@xrengine/client-core/src/user/services/AuthService'

import { Grid } from '@mui/material'

import { InventoryService, useInventoryState } from '../services/InventoryService'
import styles from '../style/ui.module.scss'
import Trading from '../Trading'
import InventoryContent from './InventoryContent'

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

  console.log(authState.authUser.identityProvider.userId.value)
  return (
    <div className={styles.menuPanel}>
      {isLoading ? (
        'Loading...'
      ) : (
        <Grid container spacing={2} columns={16}>
          <Grid item xs={8}>
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
          </Grid>
          <Grid item xs={8}>
            <Trading id="1" />
          </Grid>
        </Grid>
      )}
    </div>
  )
}

export default Inventory

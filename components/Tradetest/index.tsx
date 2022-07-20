import React, { useEffect, useState } from 'react'

import { AuthService, useAuthState } from '@xrengine/client-core/src/user/services/AuthService'

import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'

import { InventoryService, useInventoryState } from '../services/InventoryService'
import styles from '../style/ui.module.scss'
import Trading from '../Trading'
import OtherTradingContent from '../Trading/otherTrade'
import TradeTestContent from './TradeTestContent'

interface Props {
  changeActiveMenu?: any
  id: String
}

export const Tradetest = (props: Props): any => {
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
    <Box sx={{ width: '100%' }} className={styles.cards_trade_grid}>
      <Grid
        container
        spacing={3}
        direction="row"
        justifyItems="center"
        alignItems="stretch"
        className={styles.menu_grid}
      >
        <Grid item xs={6}>
          <Grid container spacing={3}>
            <Grid item xs={12} className={styles.trade_grid}>
              <Trading coinData={coinData} />
            </Grid>
            <Grid item xs={12} className={styles.trade_grid}>
              <OtherTradingContent id="1" coinData={coinData} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid style={{ height: '100%' }}>
            <div className={styles.menuPanel}>
              {isLoading ? (
                'Loading...'
              ) : (
                <TradeTestContent
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
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Tradetest

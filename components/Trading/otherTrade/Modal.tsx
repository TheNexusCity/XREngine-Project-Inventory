import * as React from 'react'

import { AuthService, useAuthState } from '@xrengine/client-core/src/user/services/AuthService'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'

import { InventoryTradeService, useInventoryTradeState } from '../../services/TradeServiceTest'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

export default function AlertDialogSlide() {
  const [open, setOpen] = React.useState(false)
  const authState = useAuthState()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const resetTrade = () => {
    InventoryTradeService.fetchInventoryListTrade(authState.authUser.identityProvider.userId.value)
  }
  
  const handleClose = () => {
    setOpen(false)
  }

  const handleClickYes = () => {
    resetTrade()
    setOpen(false)
  }

  return (
    <div>
      <Dialog
        open={true}
        onClick={handleClickOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{'Cancel Trade Message'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">Do you want to cancel trade</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClickYes}>Yes</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

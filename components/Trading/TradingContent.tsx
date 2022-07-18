import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { usePrevious } from '@xrengine/client-core/src/hooks/usePrevious'

import { ArrowBackIos, FilterList } from '@mui/icons-material'
import CheckIcon from '@mui/icons-material/Check'
import {
  Box,
  Card,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Stack
} from '@mui/material'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Typography from '@mui/material/Typography'
import makeStyles from '@mui/styles/makeStyles'

import Slots from './TradingSlots'

const useStyles = makeStyles({
  root1: {
    width: '50%'
  },
  root: {
    width: '100%',
    height: '100%',
    color: 'white'
  },
  item: {
    border: 'solid 1px',
    borderRadius: '5px',
    borderColor: '#d9d7d78c',
    cursor: 'pointer'
  },
  modalBody: {
    backgroundColor: '#FFF'
  },
  modalBoxShadow: {
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
    backgroundColor: 'white'
  },
  itemscroll: {
    // maxHeight: '500px',
    overflow: 'scroll'
  },
  backButton: {
    opacity: 0.8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    '&:hover': {
      background: 'none',
      opacity: 1
    }
  },
  title: {
    color: 'white'
  },
  p10: {
    padding: '10px'
  },
  selecteditem: {
    border: '1px solid white'
  },
  card: {
    margin: '10px'
  },
  titlesize: {
    fontSize: '30px'
  },
  contents: {
    justifyContent: 'center'
  }
})

type itemtype = {
  addedOn: null
  fromUserId: string
  fromUserInventoryIds: any[]
  fromUserStatus: string
  toUserId: string
  toUserInventoryIds: any[]
  toUserStatus: string
  userTradeId: string
}

type StateType = {
  url: string
  metadata: string
  selectedid: string
  userid: string
  anchorEl: any
  selectedtype: string
  fortrading: itemtype[]
  offeredTrading: itemtype[]
  receivedTrading: itemtype[]
  inventoryList: any[]
  userTradeId: string
  currentPage: any
}

const ITEM_HEIGHT = 48

const TradingContent = ({
  data,
  user,
  propid,
  rejectOfferSent,
  rejectOfferReceived,
  handleTransfer,
  acceptOfferSent,
  acceptOfferReceived,
  isLoadingtransfer,
  type,
  inventory,
  removeiteminventory,
  additeminventory,
  addofferiteminventory,
  addreceiveiteminventory,
  data1,
  data0,
  removeofferinventory,
  removereceiveinventory,
  changeActiveMenu,
  coinData
}: any) => {
  const history = useHistory()
  const classes = useStyles()
  const [state, setState] = useState<StateType>({
    url: '',
    metadata: '',
    selectedid: '',
    userid: '',
    anchorEl: null,
    selectedtype: '',
    fortrading: [],
    offeredTrading: [],
    receivedTrading: [],
    userTradeId: '',
    inventoryList: [],
    currentPage: 2
  })
  const {
    url,
    metadata,
    inventoryList,
    userid,
    selectedid,
    anchorEl,
    selectedtype,
    fortrading,
    receivedTrading,
    offeredTrading,
    userTradeId
  } = state
  const prevState = usePrevious({ selectedtype })
  // const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl)
  const [openModal, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleCloseModal = () => {
    setOpen(false)
  }
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setState((prevState: any) => ({
      ...prevState,
      anchorEl: event.currentTarget
    }))
  }

  const handleClose = () => {
    setState((prevState) => ({
      ...prevState,
      anchorEl: null
    }))
  }

  const handletypeselect = (id) => {
    setState((prevState) => ({
      ...prevState,
      selectedtype: id
    }))
    handleClose()
  }

  const [items, setItems] = useState([...coinData])

  const getItemDataInSlot = (slot) => items.find((item) => item.slot === slot)

  const moveItemToSlot = (oldSlot, newSlot) => {
    setItems((currentState) => {
      let newInventory = [...currentState]
      let targetIndex: any
      newInventory.forEach((item, index) => {
        if (item.slot === oldSlot) {
          targetIndex = index
        }
      })
      newInventory[targetIndex] = { ...newInventory[targetIndex], slot: newSlot }

      return [...newInventory]
    })
  }

  const onInventoryItemDragged = ({ detail: eventData }: any) => {
    const oldSlot = parseInt(eventData.slot),
      newSlot = parseInt(eventData.destination.slot)

    if (eventData.destination.type === 'empty-slot') {
      moveItemToSlot(oldSlot, newSlot)
    }
  }

  useEffect(() => {
    if (data.length !== 0) {
      setState((prevState: any) => ({
        ...prevState,
        url: data[0].url,
        metadata: data[0].metadata,
        selectedid: data[0].inventoryItemTypeId
      }))
    }
  }, [])

  useEffect(() => {
    if (prevState) {
      if (prevState.selectedtype !== selectedtype) {
        if (selectedtype === '') {
          setState((prevState: any) => ({
            ...prevState,
            // url: data[0].url,
            // metadata: data[0].metadata,
            selectedid: inventory[0].user_inventory.userInventoryId,
            inventoryList: [...inventory]
          }))
        } else {
          let filtereddata = inventory.filter((val) => val.inventoryItemTypeId === selectedtype)
          if (filtereddata.length !== 0) {
            setState((prevState: any) => ({
              ...prevState,
              // url: filtereddata[0].url,
              // metadata: filtereddata[0].metadata,
              selectedid: filtereddata[0].user_inventory.userInventoryId,
              inventoryList: [...filtereddata]
            }))
          } else {
            setState((prevState: any) => ({
              ...prevState,
              // url: '',
              // metadata: '',
              selectedid: '',
              inventoryList: []
            }))
          }
        }
      }
    }
  }, [selectedtype])

  const onDragStart = (ev, id) => {
    ev.dataTransfer.setData('id', id)
  }

  const onDragOver = (ev) => {
    ev.preventDefault()
  }

  const onDrop = (ev, cat) => {
    let id = ev.dataTransfer.getData('id')

    // let tasks = inventory.filter((task) => {
    //   if (task.name == id) {
    //     task.category = cat;
    //   }
    //   return task;
    // });

    // setState((prevState: any) => ({
    //   ...prevState,
    //   fortrading: [...tasks]
    // }))
  }
  const addfortrade = (value: any, index) => {
    const fortrading = [...state.fortrading, { ...value }]
    setState((prevState: any) => ({
      ...prevState,
      fortrading
    }))
    removeiteminventory(index)
  }
  const offerfortrade = (value: any, index) => {
    const offeredTrading = [...state.offeredTrading, { ...value }]
    setState((prevState: any) => ({
      ...prevState,
      offeredTrading,
      userTradeId: data0[0].userTradeId
    }))
    localStorage.setItem('tradeId', data0[0].userTradeId)

    removeofferinventory(index)
  }
  const receivefortrade = (value: any, index) => {
    const receivedTrading = [...state.receivedTrading, { ...value }]

    setState((prevState: any) => ({
      ...prevState,
      receivedTrading,
      userTradeId: data1[0].userTradeId
    }))
    localStorage.setItem('tradeId', data1[0].userTradeId)

    removereceiveinventory(index)
  }

  const inventoryback = (value: any, index) => {
    const fortradingtemp = [...state.fortrading]
    fortradingtemp.splice(index, 1)
    setState((prevState: any) => ({
      ...prevState,
      fortrading: [...fortradingtemp]
    }))
    additeminventory(value)
  }
  const offeredback = (value: any, index) => {
    const offeredTradingtemp = [...state.offeredTrading]
    offeredTradingtemp.splice(index, 1)
    setState((prevState: any) => ({
      ...prevState,
      offeredTrading: [...offeredTradingtemp]
    }))
    addofferiteminventory(value)
  }
  const receivedback = (value: any, index) => {
    const receivedTradingtemp = [...state.receivedTrading]
    receivedTradingtemp.splice(index, 1)
    setState((prevState: any) => ({
      ...prevState,
      receivedTrading: [...receivedTradingtemp]
    }))
    addreceiveiteminventory(value)
  }
  const inventoryLimit = 9
  const getCurrentSlots = () => {
    const res: any = []
    const startIndex = (state.currentPage - 1) * inventoryLimit
    const endIndex = state.currentPage * inventoryLimit
    for (let i = startIndex; i < endIndex; i++) res.push(i)
    console.log(res)

    return res
  }

  useEffect(() => {
    document.addEventListener('inventoryItemDragged', onInventoryItemDragged)
    if (data.length !== 0) {
      setState((prevState: any) => ({
        ...prevState,
        url: data[0].url,
        metadata: data[0].metadata,
        selectedid: data[0].user_inventory?.userInventoryId,
        inventory: [...data]
      }))
    }

    return () => {
      document.removeEventListener('inventoryItemDragged', onInventoryItemDragged)

      setState({
        url: '',
        metadata: '',
        selectedid: '',
        userid: '',
        anchorEl: null,
        selectedtype: '',
        fortrading: [],
        offeredTrading: [],
        receivedTrading: [],
        userTradeId: '',
        inventoryList: [],
        currentPage: 1
      }) // This worked for me
    }
  }, [])

  return (
    <Box className={`${classes.root} ${classes.contents}`}>
      <Stack justifyContent="center">
        <Typography className={`${classes.title} ${classes.titlesize}`}>Remote Trade</Typography>
        <Stack direction="row" justifyContent="center">
          <Stack>
            <Stack>
              {/* inventory grid */}
              <Stack
                direction="row"
                justifyContent="center"
                flexWrap={'wrap'}
                sx={{ position: 'relative' }}
                className={`inventory`}
              >
                {getCurrentSlots().map((slot) => (
                  <Slots slot={slot} value={getItemDataInSlot(slot) || null} key={slot} />
                ))}
              </Stack>
            </Stack>
            <Typography align="center" display="flex">
              <Button
                style={{ maxWidth: '100px', maxHeight: '30px', minWidth: '100px', minHeight: '30px' }}
                variant="contained"
                endIcon={<CheckIcon onClick={handleClickOpen} />}
              >
                Accept
              </Button>
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Please Confirm Trade'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">Confirm Trade item</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleCloseModal} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default TradingContent

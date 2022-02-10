import axios from 'axios'
import config from '@xrengine/server-core/src/appconfig'

export const blockchainUserWalletGenerator = async (userId, accessToken): Promise<any> => {
  let response = await axios.post(
    `${config.blockchain.blockchainUrl}/user-wallet-data`,
    {
      userId: userId
    },
    {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    }
  )
  return response
}

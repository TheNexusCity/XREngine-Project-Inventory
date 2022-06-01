import axios from 'axios'
import config from '@xrengine/server-core/src/appconfig'

export const blockchainTokenGenerator = async (): Promise<any> => {
  let response = await axios.post(`${config.blockchain.blockchainUrl}/authorizeServer`, {
    authSecretKey: config.blockchain.blockchainUrlSecret
  })
  return response
}

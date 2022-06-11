import { Principal } from '@dfinity/principal'
import { NFTIDL } from '../util/nft.did'
import DIP721_V2_IDL from '../util/dip_721_v2.did'

const nftCanisterId = 'vlhm2-4iaaa-aaaam-qaatq-cai'

export const getMyDIP721Tokens = () => {
  return new Promise(async (resolve, reject) => {
    const hasAllowed = await (window as any).ic?.plug?.requestConnect({
      whitelist: [nftCanisterId] // whitelisting canister ID's for plug
    })
    if (!hasAllowed) {
      console.error('allow the canisters')
    }


    const wallet = await (window as any).ic?.plug?.getPrincipal()
    const walletAddress = wallet.toText()

    const nftActor = await (window as any).ic?.plug?.createActor({
      canisterId: nftCanisterId,
      interfaceFactory: DIP721_V2_IDL
    })
    const name = await nftActor?.name()
    const symbol = await nftActor?.symbol()

    // My NFTS
    const myNFTs = await nftActor?.ownerTokenMetadata(Principal.fromText(walletAddress))

    resolve(myNFTs)
  })
}

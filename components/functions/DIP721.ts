import { Principal } from '@dfinity/principal'
import { NFTIDL } from '../util/nft.did'
import DIP721_V2_IDL from '../util/dip_721_v2.did'

//6hgw2-nyaaa-aaaai-abkqq-cai
//5movr-diaaa-aaaak-aaftq-cai
const nftCanisterId = "6hgw2-nyaaa-aaaai-abkqq-cai"

export const getMyDIP721Tokens = () => {
  return new Promise(async (resolve, reject) => {
    const hasAllowed = await (window as any).ic?.plug?.requestConnect({
      whitelist: ["vlhm2-4iaaa-aaaam-qaatq-cai","6hgw2-nyaaa-aaaai-abkqq-cai"] // whitelisting canister ID's for plug
    })
   
    if (!hasAllowed) {
      console.error('allow the canisters')
    }


    const wallet = await (window as any).ic?.plug?.getPrincipal()
    const walletAddress = wallet.toText()

    console.log(walletAddress);
    
    const nftActor = await (window as any).ic?.plug?.createActor({
      canisterId: nftCanisterId,
      interfaceFactory: DIP721_V2_IDL
    })
    const name = await nftActor?.name()
    const symbol = await nftActor?.symbol()

<<<<<<< HEAD
    console.log('name &&&&&& symbol ------------', name, symbol);
console.log(nftActor);

    // My NFTS
    const myNFTs = await nftActor?.ownerTokenMetadata(Principal.fromText(walletAddress))

    console.log("NFTs",myNFTs)

=======
    // My NFTS
    const myNFTs = await nftActor?.ownerTokenMetadata(Principal.fromText(walletAddress))

>>>>>>> 15f0ca47ffb0e7773784a8efac13ba37b2350e67
    resolve(myNFTs)
  })
}

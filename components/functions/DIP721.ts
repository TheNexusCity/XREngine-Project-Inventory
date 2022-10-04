import { Principal } from '@dfinity/principal'
import { NFTIDL } from '../util/nft.did'
import DIP721_V2_IDL from '../util/dip_721_v2.did'

//6hgw2-nyaaa-aaaai-abkqq-cai
//5movr-diaaa-aaaak-aaftq-cai
const nftCanisterId = "6hgw2-nyaaa-aaaai-abkqq-cai"
const nftCanister1Id = "vlhm2-4iaaa-aaaam-qaatq-cai"

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
    const nftActor1 = await (window as any).ic?.plug?.createActor({
      canisterId: nftCanister1Id,
      interfaceFactory: DIP721_V2_IDL
    })
    const name = await nftActor1?.name()
    const symbol = await nftActor1?.symbol()

    console.log('name &&&&&& symbol ------------', name, symbol);


    // My NFTS
    let NFTs;
    const cipher = await nftActor?.ownerTokenMetadata(Principal.fromText(walletAddress))
    const crown = await nftActor1?.ownerTokenMetadata(Principal.fromText(walletAddress))
    NFTs = cipher.Ok
    NFTs.unshift(crown.Ok[0].properties[5][1])
    console.log("NFT",NFTs)

    resolve(cipher)
  })
}

import { DEVELOPMENT } from "../../common/environment";
import { setCorsHeaders } from "../../common/utils.js";
import { ResponseStatus } from "../enums";
import { UserWalletData } from "../sequelize";
import { createWalletInternal } from "./wallet.js";
async function UserWalletRoutes(app){

    app.post("/api/v1/user-wallet-data", (req,res,next)=>{
        if (DEVELOPMENT) setCorsHeaders(res);
        try{
            createWalletInternal().then(walletData=>{
                console.log(walletData);
                let {userMnemonic,userAddress,privateKey} = walletData;
                let userData = {...req.body,userMnemonic,userAddress,userPrivateKey:privateKey};
                console.log(userData);
                UserWalletData.create(userData).then(resp=>{
                    res.status(200).end(JSON.stringify({"status":ResponseStatus.Success, "message": "Data Submitted Successfully."}))
                }).catch(function (err) {
                    res.status(400).end(JSON.stringify({"status":ResponseStatus.Error, "message": "Data cannot be submitted."}))
                })
                res.status(200).end(JSON.stringify({"status":ResponseStatus.Success, "message": "Data submitted successfully."}))
            });
        
        }catch{
            res.status(400).end(JSON.stringify({"status":ResponseStatus.Error, "message": "Data cannot be submitted."}))
        }
    
})
  
    app.get("/api/v1/user-wallet-data", async (req,res,next)=>{
        try{
                let userId  = req.query.userId
                let data = await UserWalletData.findAll({ where: { userId: userId } });
                if(data)
                    res.status(200).end(JSON.stringify({"status":ResponseStatus.Success, "data":data}))
                else
                    res.status(400).end(JSON.stringify({"status":ResponseStatus.Error, "message": "Data cannot be fetched."}))
            }catch (err){
                res.status(400).end(JSON.stringify({"status":ResponseStatus.Error, "message": "Data cannot be fetched."}))
            }
    })
    
}


export default {
    UserWalletRoutes
};
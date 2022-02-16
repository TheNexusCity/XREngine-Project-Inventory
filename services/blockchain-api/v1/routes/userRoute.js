import crypto from "crypto";
import { CONSOLE_WEB_URL, DEVELOPMENT } from "../../common/environment";
import { sendMessage } from "../../common/sesClient";
import { setCorsHeaders } from "../../common/utils.js";
import { ResponseStatus } from "../enums";
import { createWalletInternal } from "../routes/wallet.js";
import { UserData } from "../sequelize";
async function UserRoutes(app){

    app.post("/api/v1/user-data", (req,res,next)=>{
        if (DEVELOPMENT) setCorsHeaders(res);
        let website = CONSOLE_WEB_URL;
         // Generate token
        let token = crypto.randomBytes(48).toString("hex");
        // Append slash at the end of website url
        if (website.endsWith("/") === false) {
            website += "/";
        }
        try{

        UserData.findOne({
                where: {
                  userEmail: req.body.userEmail || "",
                },
              }).then(userData=>{
                if(userData == null){
                    createWalletInternal().then(walletData=>{
                        console.log(walletData);
                        let {userMnemonic,userAddress,privateKey} = walletData;
                        let userData = {...req.body,userMnemonic,userAddress,userPrivateKey:privateKey};
                        UserData.create(userData).then(resp=>{
                            website = `${website}authenticate?email=${userData.userEmail}&token=${token}&user=yes&admin=no&landing=dashboard`;
                            console.log(userData.userEmail);
                            // Send email with login link and token
                            sendMessage(
                                userData.userEmail,
                                "Login | Blockchain in a box",
                                `Greetings! you can access Blockchain in a box console from:\n\n
                                ${website}`,
                                `<h1>Login Information</h1>
                                <p>Greetings! you can access Blockchain in a box console from:</p>
                                <a href=${website}>${website}</a>`
                            );
                            res.status(200).end(JSON.stringify({"status":ResponseStatus.Success, "message": "Data Submitted Successfully."}))
                        }).catch(function (err) {
                            res.status(400).end(JSON.stringify({"status":ResponseStatus.Error, "message": "Data cannot be submitted."}))
                        })
                    });
                }else{
                    res.status(400).end(JSON.stringify({"status":ResponseStatus.Error, "message": "User already exist."}))
                }
              })
        }catch{
            res.status(400).end(JSON.stringify({"status":ResponseStatus.Error, "message": "Data cannot be submitted."}))
        }
    
})
  
    app.get("/api/v1/user-data", async (req,res,next)=>{
        try{
                let email  = req.query.email
                let data = await UserData.findAll({ where: { email: email } });
                if(data)
                    res.status(200).end(JSON.stringify({"status":ResponseStatus.Success, "data":data}))
                else
                    res.status(400).end(JSON.stringify({"status":ResponseStatus.Error ,"message": "Data cannot be fetched."}))
            }catch (err){
                res.status(400).end(JSON.stringify({"status":ResponseStatus.Error, "message": "Data cannot be fetched."}))
            }
    })
    
}


export default {
    UserRoutes
};
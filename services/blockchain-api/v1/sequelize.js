import dotenv from "dotenv";
dotenv.config();
import Sequelize from "sequelize";
import UserModel from "./models/usersData";
import AdminModel from "./models/adminData";
import AddressDataModel from "./models/addressData";
import EnvironmentDataModel from "./models/environmentData";
import OnboardingDataModel from "./models/onboardingData";
import TimerDataModel from "./models/timerData";
import UserWalletDataModel from "./models/userWalletData";

import sequelize from "../../db";
const AdminData = AdminModel(sequelize, Sequelize);
const UserData = UserModel(sequelize, Sequelize);
const AddressData = AddressDataModel(sequelize, Sequelize);
const EnvironmentData = EnvironmentDataModel(sequelize, Sequelize);
const OnBoardingData = OnboardingDataModel(sequelize, Sequelize);
const TimerData = TimerDataModel(sequelize, Sequelize);
const UserWalletData = UserWalletDataModel(sequelize, Sequelize);

sequelize.sync().then(() => {
  // eslint-disable-next-line no-console
  console.log('Users db and user table have been created 2'); 
});



export default { AdminData, AddressData, EnvironmentData, OnBoardingData, UserData, TimerData, UserWalletData, sequelize };
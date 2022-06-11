import { Sequelize, DataTypes, Model } from 'sequelize'
import { Application } from '@xrengine/server-core/declarations'
import { UserInventoryInterface } from '../../interfaces/InventoryInterfaces';

export default (app: Application): any => {
  const sequelizeClient: Sequelize = app.get('sequelizeClient')
  const userInventory = sequelizeClient.define<Model<UserInventoryInterface>>(
    'user_inventory',
    {
      userInventoryId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        allowNull: false,
        primaryKey: true
      },
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false
      },
      addedOn: {
        type: DataTypes.DATE
      }
    },
    {
      hooks: {
        beforeCount(options: any): void {
          options.raw = true
        }
      },
      timestamps: false
    }
  )

  ;(userInventory as any).assocate = (models: any): void => {
    ;(userInventory as any).hasMany(models.inventory_item, { foreignKey: "userInventoryId" })
    ;(userInventory as any).belongsTo(models.user, { required: true, allowNull: false })
  }

  return userInventory
}

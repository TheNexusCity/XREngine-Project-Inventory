import { Sequelize, DataTypes, Model } from 'sequelize'
import { Application } from '@xrengine/server-core/declarations'
import { InventoryItemInterface } from '../../interfaces/InventoryInterfaces'

export default (app: Application): any => {
  const sequelizeClient: Sequelize = app.get('sequelizeClient')
  const inventoryItem = sequelizeClient.define<Model<InventoryItemInterface>>(
    'inventory_item',
    {
      inventoryItemId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      },
      isCoin: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      version: DataTypes.INTEGER,
      metadata: {
        type: DataTypes.JSON,
        defaultValue: {},
        allowNull: true,
        get(this: any): string | JSON {
          const metaData = this.getDataValue('metadata')
          if (!metaData) {
            return ''
          } else {
            return metaData
          }
        }
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      hooks: {
        beforeCount(options: any): void {
          options.raw = true
        }
      }
    }
  )

  ;(inventoryItem as any).associate = (models: any): void => {
    ;inventoryItem.belongsTo(models.user, { foreignKey: "userId"})
    ;inventoryItem.belongsTo(models.user_inventory,  { foreignKey: "userInventoryId"})
  }

  return inventoryItem
}

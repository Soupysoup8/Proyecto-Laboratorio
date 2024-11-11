import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Usuario extends Model {
  public id!: number;
  public nombre!: string;
  public password!: string;
}

Usuario.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Usuario',
  tableName: 'usuarios',
  timestamps: false,
});

export default Usuario;

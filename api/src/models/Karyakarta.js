// src/models/Karyakarta.js
// ============================================================
// Sequelize model for `karyakartas` table
// Party worker directory (5,000–10,000 workers per constituency)
// ============================================================

import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

class Karyakarta extends Model {}

Karyakarta.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    full_name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    full_name_en: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    mobile: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true,
    },
    alt_mobile: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    village_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ward_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    gram_panchayat_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    taluka_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    booth_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 101,
    },
    designation: {
      type: DataTypes.ENUM(
        'BOOTH_PRAMUKH',
        'WARD_HEAD',
        'SHAKTI_KENDRA',
        'KARYAKARTA',
        'VOLUNTEER',
        'OTHER'
      ),
      allowNull: false,
      defaultValue: 'KARYAKARTA',
    },
    profile_photo_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    joined_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' },
    },
  },
  {
    sequelize,
    tableName: 'karyakartas',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

Karyakarta.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

export default Karyakarta;

// src/models/DevWorkPhoto.js
// ============================================================
// Sequelize model for `dev_work_photos` table
// Geotagged photos for development work projects (Before / During / After)
// ============================================================

import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import DevelopmentWork from './DevelopmentWork.js';
import User from './User.js';

class DevWorkPhoto extends Model {}

DevWorkPhoto.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    development_work_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'development_works', key: 'id' },
    },
    photo_url: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    thumbnail_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    photo_stage: {
      type: DataTypes.ENUM('BEFORE', 'DURING', 'AFTER'),
      allowNull: false,
      defaultValue: 'DURING',
    },
    geo_latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },
    geo_longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },
    caption: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    uploaded_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
  },
  {
    sequelize,
    tableName: 'dev_work_photos',
    timestamps: true,
    updatedAt: false,
    createdAt: 'created_at',
    underscored: true,
  }
);

DevWorkPhoto.belongsTo(DevelopmentWork, { foreignKey: 'development_work_id', as: 'devWork' });
DevWorkPhoto.belongsTo(User, { foreignKey: 'uploaded_by', as: 'uploader' });
DevelopmentWork.hasMany(DevWorkPhoto, { foreignKey: 'development_work_id', as: 'photos' });

export default DevWorkPhoto;

// src/models/DevelopmentWork.js
// ============================================================
// Sequelize model for `development_works` table
// Public infrastructure projects across the constituency
// ============================================================

import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

class DevelopmentWork extends Model {}

DevelopmentWork.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    project_name: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    work_title_en: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    category: {
      type: DataTypes.ENUM(
        'ROAD',
        'DRAINAGE',
        'WATER_PIPELINE',
        'HOSPITAL',
        'SCHOOL',
        'COMMUNITY_HALL',
        'STREET_LIGHT',
        'BRIDGE',
        'ELECTRIFICATION',
        'GARDEN_PARK',
        'TOILET',
        'CREMATORIUM',
        'OTHER'
      ),
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    location_en: {
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
    taluka_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    geo_latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },
    geo_longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },
    funding_source: {
      type: DataTypes.ENUM(
        'MLALAD',
        'ZP_FUND',
        'STATE_GRANT',
        'CENTRAL_GRANT',
        'MUNICIPAL_FUND',
        'GP_FUND',
        'MPLAD',
        'CSR',
        'OTHER_MIXED'
      ),
      allowNull: false,
    },
    budget_allocated: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    budget_spent: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    contractor_name: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    contractor_contact: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    expected_completion_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    actual_completion_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('SANCTIONED', 'IN_PROGRESS', 'COMPLETED', 'DELAYED', 'CANCELLED'),
      allowNull: false,
      defaultValue: 'SANCTIONED',
    },
    progress_percentage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    description: {
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
    tableName: 'development_works',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

DevelopmentWork.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

export default DevelopmentWork;

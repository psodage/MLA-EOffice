// src/models/Department.js
// ============================================================
// Sequelize model for `departments` table
// Government department directory
// ============================================================

import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Department extends Model {}

Department.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name_en: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    name_mr: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    short_code: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
    },
    officer_name: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    officer_designation: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    office_address: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    sort_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'departments',
    timestamps: false,
    underscored: true,
  }
);

export default Department;

// src/models/Category.js
// ============================================================
// Sequelize model for `categories` table
// Nivedan complaint categories and sub-categories
// ============================================================

import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import Department from './Department.js';

class Category extends Model {}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
    },
    name_en: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    name_mr: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'categories', key: 'id' },
    },
    default_department_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'departments', key: 'id' },
    },
    escalation_days: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
    },
    default_priority: {
      type: DataTypes.ENUM('HIGH', 'MEDIUM', 'LOW'),
      allowNull: false,
      defaultValue: 'MEDIUM',
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
    tableName: 'categories',
    timestamps: false,
    underscored: true,
  }
);

Category.belongsTo(Department, { foreignKey: 'default_department_id', as: 'defaultDepartment' });
Category.hasMany(Category, { foreignKey: 'parent_id', as: 'subCategories' });
Category.belongsTo(Category, { foreignKey: 'parent_id', as: 'parentCategory' });

export default Category;

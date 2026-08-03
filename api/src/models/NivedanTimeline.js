// src/models/NivedanTimeline.js
// ============================================================
// Sequelize model for `nivedan_timeline` table
// Immutable activity history per nivedan
// ============================================================

import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import Department from './Department.js';
import User from './User.js';

class NivedanTimeline extends Model {}

NivedanTimeline.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nivedan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'nivedans', key: 'id' },
    },
    action_type: {
      type: DataTypes.ENUM(
        'CREATED',
        'STATUS_CHANGE',
        'ASSIGNED',
        'FORWARDED',
        'NOTE_ADDED',
        'WHATSAPP_SENT',
        'ESCALATED',
        'RESOLVED',
        'REJECTED',
        'CANCELLED',
        'ARCHIVED'
      ),
      allowNull: false,
    },
    old_status: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    new_status: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    assigned_to_user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' },
    },
    department_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'departments', key: 'id' },
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_internal: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    performed_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
  },
  {
    sequelize,
    tableName: 'nivedan_timeline',
    timestamps: true,
    updatedAt: false, // Timeline entries are append-only
    createdAt: 'created_at',
    underscored: true,
  }
);

NivedanTimeline.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });
NivedanTimeline.belongsTo(User, { foreignKey: 'assigned_to_user_id', as: 'assignedTo' });
NivedanTimeline.belongsTo(User, { foreignKey: 'performed_by', as: 'performer' });

export default NivedanTimeline;

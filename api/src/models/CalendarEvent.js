// src/models/CalendarEvent.js
// ============================================================
// Sequelize model for `calendar_events` table
// Office schedule, meetings, government deadlines, and public events
// ============================================================

import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

class CalendarEvent extends Model {}

CalendarEvent.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    event_type: {
      type: DataTypes.ENUM(
        'MEETING',
        'PUBLIC_PROGRAM',
        'GOVT_DEADLINE',
        'ASSEMBLY_SESSION',
        'CONSTITUENCY_VISIT',
        'PERSONAL'
      ),
      allowNull: false,
      defaultValue: 'MEETING',
    },
    event_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    attendees: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    is_recurring: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    recurrence_rule: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    reminder_minutes: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 30,
    },
    is_cancelled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
  },
  {
    sequelize,
    tableName: 'calendar_events',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

CalendarEvent.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

export default CalendarEvent;

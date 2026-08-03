// src/models/InwardEntry.js
// ============================================================
// Sequelize model for `inward_entries` table
// Incoming letters and documents received at MLA office
// ============================================================

import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import Department from './Department.js';
import User from './User.js';

class InwardEntry extends Model {
  /**
   * Helper to generate sequential inward number format: INW/YYYY/NNNN
   * @returns {Promise<string>} e.g. INW/2026/0001
   */
  static async generateInwardNumber() {
    const year = new Date().getFullYear();
    const prefix = `INW/${year}/`;

    const lastEntry = await InwardEntry.findOne({
      where: {
        inward_number: {
          [sequelize.Sequelize.Op.like]: `${prefix}%`,
        },
      },
      order: [['id', 'DESC']],
    });

    let sequence = 1;
    if (lastEntry && lastEntry.inward_number) {
      const parts = lastEntry.inward_number.split('/');
      if (parts.length === 3) {
        const lastSeq = parseInt(parts[2], 10);
        if (!isNaN(lastSeq)) {
          sequence = lastSeq + 1;
        }
      }
    }

    return `${prefix}${sequence.toString().padStart(4, '0')}`;
  }
}

InwardEntry.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    inward_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    date_received: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    sender_name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    sender_designation: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    sender_department_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'departments', key: 'id' },
    },
    subject: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    priority: {
      type: DataTypes.ENUM('HIGH', 'MEDIUM', 'LOW'),
      allowNull: false,
      defaultValue: 'MEDIUM',
    },
    attachment_urls: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    assigned_to_user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' },
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'),
      allowNull: false,
      defaultValue: 'PENDING',
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
    tableName: 'inward_entries',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

// Associations
InwardEntry.belongsTo(Department, { foreignKey: 'sender_department_id', as: 'department' });
InwardEntry.belongsTo(User, { foreignKey: 'assigned_to_user_id', as: 'assignedTo' });
InwardEntry.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
InwardEntry.belongsTo(User, { foreignKey: 'updated_by', as: 'updater' });

export default InwardEntry;

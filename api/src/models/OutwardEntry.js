// src/models/OutwardEntry.js
// ============================================================
// Sequelize model for `outward_entries` table
// Outgoing letters and correspondence sent from the MLA office
// ============================================================

import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import Department from './Department.js';
import InwardEntry from './InwardEntry.js';
import User from './User.js';

class OutwardEntry extends Model {
  /**
   * Helper to generate sequential outward number format: OUT/YYYY/NNNN
   * @returns {Promise<string>} e.g. OUT/2026/0001
   */
  static async generateOutwardNumber() {
    const year = new Date().getFullYear();
    const prefix = `OUT/${year}/`;

    const lastEntry = await OutwardEntry.findOne({
      where: {
        outward_number: {
          [sequelize.Sequelize.Op.like]: `${prefix}%`,
        },
      },
      order: [['id', 'DESC']],
    });

    let sequence = 1;
    if (lastEntry && lastEntry.outward_number) {
      const parts = lastEntry.outward_number.split('/');
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

OutwardEntry.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    outward_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    date_sent: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    recipient_name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    recipient_designation: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    recipient_department_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'departments', key: 'id' },
    },
    subject: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    body_text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    letter_pdf_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    reference_inward_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'inward_entries', key: 'id' },
    },
    is_ai_drafted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    attachment_urls: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    approved_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' },
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
  },
  {
    sequelize,
    tableName: 'outward_entries',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

// Associations
OutwardEntry.belongsTo(Department, { foreignKey: 'recipient_department_id', as: 'recipientDepartment' });
OutwardEntry.belongsTo(InwardEntry, { foreignKey: 'reference_inward_id', as: 'referenceInward' });
OutwardEntry.belongsTo(User, { foreignKey: 'approved_by', as: 'approver' });
OutwardEntry.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

export default OutwardEntry;

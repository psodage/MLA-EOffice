// src/models/Nivedan.js
// ============================================================
// Sequelize model for `nivedans` table
// Citizen complaints and petitions (Most critical table)
// ============================================================

import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import Category from './Category.js';
import Department from './Department.js';
import User from './User.js';
import NivedanTimeline from './NivedanTimeline.js';

class Nivedan extends Model {
  /**
   * Generate sequential tracking ID: NIV-YYYY-NNNNN
   * @returns {Promise<string>} e.g. NIV-2026-00001
   */
  static async generateTrackingId() {
    const year = new Date().getFullYear();
    const prefix = `NIV-${year}-`;

    const lastEntry = await Nivedan.findOne({
      where: {
        tracking_id: {
          [sequelize.Sequelize.Op.like]: `${prefix}%`,
        },
      },
      order: [['id', 'DESC']],
    });

    let sequence = 1;
    if (lastEntry && lastEntry.tracking_id) {
      const parts = lastEntry.tracking_id.split('-');
      if (parts.length === 3) {
        const lastSeq = parseInt(parts[2], 10);
        if (!isNaN(lastSeq)) {
          sequence = lastSeq + 1;
        }
      }
    }

    return `${prefix}${sequence.toString().padStart(5, '0')}`;
  }
}

Nivedan.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    tracking_id: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    citizen_name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    citizen_mobile: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    citizen_address_line: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    citizen_city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    citizen_pincode: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    citizen_state: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: 'Maharashtra',
    },
    citizen_dob: {
      type: DataTypes.DATEONLY,
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
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'categories', key: 'id' },
    },
    sub_category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'categories', key: 'id' },
    },
    subject: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    attachment_urls: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        'PENDING',
        'IN_PROGRESS',
        'FORWARDED',
        'AWAITING_RESPONSE',
        'RESOLVED',
        'REJECTED',
        'CANCELLED',
        'ARCHIVED'
      ),
      allowNull: false,
      defaultValue: 'PENDING',
    },
    priority: {
      type: DataTypes.ENUM('HIGH', 'MEDIUM', 'LOW'),
      allowNull: false,
      defaultValue: 'MEDIUM',
    },
    assigned_to_user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' },
    },
    department_forwarded_to_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'departments', key: 'id' },
    },
    resolution_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    escalation_level: {
      type: DataTypes.ENUM('NONE', 'LEVEL_1', 'LEVEL_2'),
      allowNull: false,
      defaultValue: 'NONE',
    },
    escalated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    whatsapp_notified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    linked_visitor_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    resolved_at: {
      type: DataTypes.DATE,
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
    tableName: 'nivedans',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

// Associations
Nivedan.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
Nivedan.belongsTo(Category, { foreignKey: 'sub_category_id', as: 'subCategory' });
Nivedan.belongsTo(Department, { foreignKey: 'department_forwarded_to_id', as: 'forwardedDepartment' });
Nivedan.belongsTo(User, { foreignKey: 'assigned_to_user_id', as: 'assignedTo' });
Nivedan.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
Nivedan.hasMany(NivedanTimeline, { foreignKey: 'nivedan_id', as: 'timeline' });

export default Nivedan;

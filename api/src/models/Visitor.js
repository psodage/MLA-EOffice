// src/models/Visitor.js
// ============================================================
// Sequelize model for `visitors` table
// Office visitor register — every person who visits the MLA office
// ============================================================

import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';
import Nivedan from './Nivedan.js';

class Visitor extends Model {
  /**
   * Helper to check repeat visitor status by mobile lookup
   * @param {string} mobile
   * @returns {Promise<{ isRepeat: boolean, previousCount: number, lastVisit: object|null }>}
   */
  static async getRepeatVisitorDetails(mobile) {
    const cleanMobile = mobile.trim();
    const previousVisits = await Visitor.findAll({
      where: { mobile: cleanMobile },
      order: [['check_in_time', 'DESC']],
    });

    const count = previousVisits.length;
    return {
      isRepeat: count > 0,
      previousCount: count,
      lastVisit: count > 0 ? previousVisits[0] : null,
    };
  }
}

Visitor.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    visitor_name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    visitor_name_en: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    mobile: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    address_line: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: 'राहाता',
    },
    pincode: {
      type: DataTypes.STRING(10),
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
    purpose: {
      type: DataTypes.ENUM(
        'GRIEVANCE',
        'COURTESY_CALL',
        'PARTY_WORK',
        'INVITATION',
        'PERSONAL_MEETING',
        'DOCUMENT_SUBMISSION',
        'FOLLOWUP',
        'RECOMMENDATION',
        'GENERAL_INQUIRY',
        'OTHER'
      ),
      allowNull: false,
    },
    purpose_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    purpose_description_en: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    check_in_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    check_out_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    is_repeat_visitor: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    previous_visit_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    linked_nivedan_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'nivedans', key: 'id' },
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
  },
  {
    sequelize,
    tableName: 'visitors',
    timestamps: true,
    updatedAt: false,
    createdAt: 'created_at',
    underscored: true,
  }
);

Visitor.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
Visitor.belongsTo(Nivedan, { foreignKey: 'linked_nivedan_id', as: 'linkedNivedan' });

export default Visitor;

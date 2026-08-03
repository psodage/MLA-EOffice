// src/models/User.js
// ============================================================
// Sequelize model for the `users` table.
// Includes auth columns (token_version, lockout, password history).
// ============================================================

import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class User extends Model {
  /**
   * Check if the account is locked (5+ failed attempts in last 15 min)
   * @param {number} lockoutMinutes
   * @returns {boolean}
   */
  isLocked(lockoutMinutes = 15) {
    if (this.failed_login_count < 5) return false;
    if (!this.last_failed_login_at) return false;
    const lockoutEnd = new Date(this.last_failed_login_at.getTime() + lockoutMinutes * 60 * 1000);
    return new Date() < lockoutEnd;
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    full_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('MLA', 'PA', 'RECEPTIONIST', 'AUDITOR', 'BOOTH_PRAMUKH', 'CITIZEN', 'ADMIN'),
      allowNull: false,
    },
    mobile: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    profile_photo_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    accessible_modules: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    last_login_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    last_login_ip: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    refresh_token: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    // ── Auth columns (Migration 24) ──────────────────────────
    password_changed_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    password_history: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null,
    },
    token_version: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    failed_login_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    last_failed_login_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    defaultScope: {
      attributes: {
        exclude: ['password_hash', 'refresh_token', 'password_history'],
      },
    },
    scopes: {
      withPassword: {
        attributes: { include: ['password_hash', 'password_history'] },
      },
      withRefreshToken: {
        attributes: { include: ['refresh_token'] },
      },
    },
  }
);

export default User;

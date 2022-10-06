'use strict';
const {
  Model,
  Validator
} = require('sequelize');
const bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    /**
     * The purpose of a "safe" object is to not accidentally expose
     * sensitive information (hashed password, createdAt date, etc)
     * @returns an object containing the id, username, and email
     */
    toSafeObject() {
      const { id, username, email } = this;
      return { id, username, email }
    }

    /**
     * Compare the presented password hash to the hash we have on file.
     * @param {string} password - the presented password at login
     * @returns {boolean} - whether the presented password matches the one on file
     */
    validatePassword(password) {
      return bcrypt.compareSync(password, this.hashedPassword.toString())
    }

    getCurrentUserById(id) {
      return Users.scope("currentUser").findByPk(id)
    }

    /**
     * Logs a user in based on the provided credential and password.
     * Once the password is verified, return the user without password in scope.
     * @param {{string}} credential - the username or email
     * @param {{string}} password - the password, already hashed
     * @returns
     */
    static async login({ credential, password }) {
      const { Op } = require('Sequelize')
      const user = await Users.scope("loginUser").findOne({
        where: {
          [Op.or]: {
            username: credential,
            email: credential
          }
        }
      });
      if (user && user.validatePassword(password)) {
        return await Users.scope("currentUser").findByPk(user.id);
      }
    }

    static async signup({ username, email, password }) {
      const hashedPassword = bcrypt.hashSync(password);
      const user = await Users.create({
        username,
        email,
        hashedPassword
      })
      return await Users.scope('currentUser').findByPk(user.id)
    }
  }
  Users.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [4, 30],
        isNotEmail(username) {
          if (Validator.isEmail(username)) {
            throw new Error("Username cannot be an email.")
          }
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 256],
        isEmail: true
        // allowOnlyEmail(emailAddress) {
        //   if (!Validator.isEmail(emailAddress)) {
        //     throw new Error("Proposed email address as improper format.")
        //   }
        // }
      }
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: false,
      validate: {
        len: [60, 60]
      }
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Users',
    defaultScope: {
      attributes: {
        exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
      }
    },
    scopes: {
      currentUser: {
        attributes: {
          exclude: ["hashedPassword"]
        }
      },
      loginUser: {
        attributes: {} //purpousfully left blank
      }
    }
  });
  return Users;
};

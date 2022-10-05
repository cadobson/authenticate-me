'use strict';
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Users', [
      {
        email: "demo1@site.com",
        username: "DemoUser1",
        hashedPassword: bcrypt.hashSync("password")
      },
      {
        email: "bemo2@bite.bom",
        username: "DemoUser2",
        hashedPassword: bcrypt.hashSync("password2")
      },
    ], {})
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const Op = Sequelize.Op
    return queryInterface.bulkDelete('Users', {
      username: {
        [Op.in]: ["DemoUser1", "DemoUser2"]
      }
    }, {})
  }
};

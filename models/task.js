"use strict";

var Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {
    var Task = sequelize.define("Task", {
            taskid: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,},
            title: {type: Sequelize.STRING, allowNull: false},
            userid: {type: Sequelize.INTEGER, allowNull: false},
            datecreated: {type: Sequelize.DATE, defaultValue: Sequelize.NOW, allowNull: false}
        },
        {
            timestamps: false,
            createdAt: false,
            updatedAt: false,
            deletedAt: 'destroyTime',
            paranoid: true,
            classMethods: {
                associate: function (models) {
                    Task.belongsTo(models.User, {
                        onDelete: "CASCADE",
                        foreignKey: {
                            name: 'userid',
                            allowNull: false
                        }
                    });
                }
            }
        }
    );

    return Task;
};
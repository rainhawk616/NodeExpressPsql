"use strict";

var Sequelize = require('sequelize');
var bcrypt = require('bcrypt');

module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define("User",
        {
            userid: {
                type: Sequelize.INTEGER,
                primaryKey: true, autoIncrement: true,
                allowNull: false
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    isEmail: true
                }
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
                set: function (val) {
                    var salt = bcrypt.genSaltSync(10);
                    var hash = bcrypt.hashSync(val, salt);
                    this.setDataValue('password', hash);
                }
            },
            datecreated: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
                allowNull: false
            },
            tos: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false
            }
        },
        {
            timestamps: false,
            createdAt: false,
            updatedAt: false,
            deletedAt: 'destroyTime',
            paranoid: true,
            classMethods: {
                associate: function (models) {
                    User.hasMany(models.Task, {
                            foreignKey: {
                                name: 'userid',
                                allowNull: false
                            }
                        }
                    )
                }
            },
            instanceMethods: {
                comparePasswords: function (candidatePassword, done) {
                    return bcrypt.compare(candidatePassword, this.password, function (err, res) {
                        return done(err, res);
                    });
                }
            }
        }
    );

    return User;
};

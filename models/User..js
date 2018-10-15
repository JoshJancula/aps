var bcrypt = require('bcrypt-nodejs');

module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define("User", {
        Username: {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        FirstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        LastName: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        Role: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        Email: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        Phone: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: true,
        },
        Active: {
            type: DataTypes.BOOLEAN,
            unique: false,
            allowNull: false,
        }
    });

    User.prototype.validPassword = function (password) {
        return bcrypt.compareSync(password, this.Password);
    };

    User.hook("beforeCreate", function (user) {
        user.password = bcrypt.hashSync(user.Password, bcrypt.genSaltSync(10), null);
    });


    User.associate = function (models) {
        User.belongsTo(models.Franchise, {
            foreignKey: {
                allowNull: false
            }
        });
        User.hasMany(models.Message, {
            foreignKey: {
                allowNull: false
            }
        });
        User.hasMany(models.Post, {
            foreignKey: {
                allowNull: false
            }
        });
    }

    return User;
};



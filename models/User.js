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
    
    User.beforeCreate(function (next) {
        var user = this;
        if (this.isModified('Password') || this.isNew) {
            bcrypt.genSalt(10, function (err, salt) {
                if (err) {
                    return next(err);
                }
                bcrypt.hash(user.Password, salt, null, function (err, hash) {
                    if (err) {
                        return next(err);
                    }
                    user.Password = hash;
                    next();
                });
            });
        } else {
            return next();
        }
    });

    User.comparePassword = function (passw, cb) {
        bcrypt.compare(passw, this.Password, function (err, isMatch) {
            if (err) {
                return cb(err);
            }
            cb(null, isMatch);
        });
    };

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



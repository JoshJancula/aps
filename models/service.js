module.exports = function (sequelize, DataTypes) {
    var Service = sequelize.define("Service", {

        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Name: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        Description: {
            type: DataTypes.TEXT,
            unique: false,
            allowNull: false,
        },
        Rate: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        }
    });

    Service.associate = function (models) {
        Service.belongsTo(models.Franchise, {
            foreignKey: {
                allowNull: false
            }
        });
    }

    return Service;
};
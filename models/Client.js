module.exports = function (sequelize, DataTypes) {
    var Client = sequelize.define("Client", {

        Name: {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },

        Description: {
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
            allowNull: false,
        }
    });

    return Client;
};
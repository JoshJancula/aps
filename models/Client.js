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
        StreetAddress: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: true,
        },
        City: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: true,
        },
        State: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: true,
        },
        Zip: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: true,
        },
        Description: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: true,
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
        ContactPerson: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: true,
        },
    });

    Client.associate = function (models) {
        Client.belongsTo(models.Franchise, {
            foreignKey: {
                allowNull: false
            }
        });
    }

    return Client;
};
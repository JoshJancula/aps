var Sequelize = require('sequelize')

module.exports = function (sequelize, DataTypes) {
    var Invoice = sequelize.define("Invoice", {
        
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Employee: {
            type: DataTypes.JSON,
            unique: false,
            allowNull: false,
        },
        Client: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            unique: false,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            unique: false,
            allowNull: false,
        },
        Total: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        Paid: {
            type: DataTypes.BOOLEAN,
            unique: false,
            allowNull: false,
        },
        PaymentMethod: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: true,
        },
        PO: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: true,
        },
        Vehicle: {
            type: Sequelize.ARRAY(Sequelize.TEXT),
            unique: false,
            defaultValue: [],
            field: 'accepted_candidates', 
            allowNull: true,
        }
    });

    Invoice.associate = function (models) {
        Invoice.belongsTo(models.Franchise, {
            foreignKey: {
                allowNull: false
            }
        });
    }

    return Invoice;
};
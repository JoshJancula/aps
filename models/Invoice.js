module.exports = function (sequelize, DataTypes) {
    var Invoice = sequelize.define("Invoice", {
        
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Employee: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        EmployeeId: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        Stripes: {
            type: DataTypes.TEXT,
            unique: false,
            allowNull: true,
        },
        Tint: {
            type: DataTypes.TEXT,
            unique: false,
            allowNull: true,
        },
        PPF: {
            type: DataTypes.TEXT,
            unique: false,
            allowNull: true,
        },
        OtherServices: {
            type: DataTypes.TEXT,
            unique: false,
            allowNull: true,
        },
        Client: {
            type: DataTypes.STRING,
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
        CheckNumber: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: true,
        },
        CustomPinstripe:  {
            type: DataTypes.STRING,
            unique: false,
            allowNull: true,
        },
        RO: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: true,
        },
        VIN: {
            type: DataTypes.TEXT,
            unique: false,
            allowNull: true,
        },
        Stock: {
            type: DataTypes.TEXT,
            unique: false,
            allowNull: true,
        },
        Description: {
            type: DataTypes.TEXT,
            unique: false,
            allowNull: true,
        },
        VehicleDescription: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: true,
        },
        Comments: {
            type: DataTypes.TEXT,
            unique: false,
            allowNull: true,
        },
    }, {
        timestamps: true,
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
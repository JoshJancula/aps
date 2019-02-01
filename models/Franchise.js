module.exports = (sequelize, DataTypes) => {
    const Franchise = sequelize.define("Franchise", {
        Name: {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        Phone: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        Email: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        Address: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        TaxRate: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        Active: {
            type: DataTypes.BOOLEAN,
            unique: false,
            allowNull: false,
        }
    });

    Franchise.associate = (models) => {
        // Associating the franchise with the following
        Franchise.hasMany(models.User, {
            onDelete: "cascade"
        });
        Franchise.hasMany(models.Appointment, {
            onDelete: "cascade"
        });
        Franchise.hasMany(models.Invoice, {
            onDelete: "cascade"
        });
        Franchise.hasMany(models.Client, {
            onDelete: "cascade"
        });
    };

    return Franchise;
};
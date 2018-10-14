module.exports = function (sequelize, DataTypes) {
    var Vehicle = sequelize.define("Vehicle", {
        
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Make: {
            type: DataTypes.JSON,
            unique: false,
            allowNull: true,
        },
        Model: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: true,
        },
        Color: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: true,
        },
        VIN: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: true,
        }
    });

    Vehicle.associate = function (models) {
        Vehicle.belongsToMany(models.Invoice, {
            through: 'Vehicle',
            foreignKey: "Vehicle",
            as: 'Vehicles'
          });
    }

    return Vehicle;
};
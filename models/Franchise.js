module.exports = function (sequelize, DataTypes) {
    var Franchise = sequelize.define("Franchise", {
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
        Active: {
            type: DataTypes.BOOLEAN,
            unique: false,
            allowNull: false,
        }
    });

    Franchise.associate = function (models) {
        // Associating the franchise with the following
        Franchise.hasMany(models.User, {
            onDelete: "cascade"
        });
    };

    return Franchise;
};
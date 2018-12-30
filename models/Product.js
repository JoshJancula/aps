module.exports = function (sequelize, DataTypes) {
    var Product = sequelize.define("Product", {

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

    Product.associate = function (models) {
        Product.belongsTo(models.Franchise, {
            foreignKey: {
                allowNull: false
            }
        });
    }

    return Product;
};
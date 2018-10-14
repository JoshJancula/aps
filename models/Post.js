module.exports = function (sequelize, DataTypes) {
    var Post = sequelize.define("Post", {

        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
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
        }
    });

    Post.associate = function (models) {
        Post.belongsTo(models.Message, {
            foreignKey: {
                allowNull: false
            }
        });
        Post.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        });
    }

    return Post;
};
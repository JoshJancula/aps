module.exports = function (sequelize, DataTypes) {
    var Message = sequelize.define("Message", {

        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        }
    });

    Message.associate = function (models) {
        Message.belongsToMany(models.User, {
            through: 'Message',
            foreignKey: "Message",
            as: 'Messages'
        });
        Message.hasMany(models.Post, {
            foreignKey: {
                allowNull: false
            }
        });
    }

    return Message;
};
module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define("Message", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Author: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        AuthorId: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        Recipient: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        RecipientId: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        Content: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        MessageType: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        Read: {
            type: DataTypes.BOOLEAN,
            unique: false,
            allowNull: false,
        },   
    }, {
        timestamps: true,
    });

    return Message;
};
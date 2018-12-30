module.exports = function (sequelize, DataTypes) {
    var Appointment = sequelize.define("Appointment", {

        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Date: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        Client: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        Location: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        ScheduledBy: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        AssignedEmployee: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        Comments: {
            type: DataTypes.TEXT,
            unique: false,
            allowNull: true
        },
        Phone: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: true
        },

    });

    Appointment.associate = function (models) {
        Appointment.belongsTo(models.Franchise, {
            foreignKey: {
                allowNull: false
            }
        });
    }

    return Appointment;
};
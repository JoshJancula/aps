module.exports = (sequelize, DataTypes) => {
    const Appointment = sequelize.define("Appointment", {

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
        Time: {
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
        ContactPerson: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        ContactPersonPhone: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: true,
        },
        ScheduledBy: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        ScheduledById: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        AssignedEmployee: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: true,
        },
        AssignedEmployeeId: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: true,
        },
        Comments: {
            type: DataTypes.TEXT,
            unique: false,
            allowNull: true
        },

    });

    Appointment.associate = (models) => {
        Appointment.belongsTo(models.Franchise, {
            foreignKey: {
                allowNull: false
            }
        });
    }

    return Appointment;
};
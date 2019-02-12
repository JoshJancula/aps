module.exports = (sequelize, DataTypes) => {
    const Timecard = sequelize.define("Timecard", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        EmployeeName: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        EmployeeId: {
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false,
        },
        FranchiseId: {
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false,
        },
        Date: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        TimeIn: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        TimeOut: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
    }, {
        timestamps: true,
    });

    return Timecard;
};
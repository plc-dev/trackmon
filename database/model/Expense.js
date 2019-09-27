module.exports = (sequelize, Sequelize) => {
    return sequelize.define(
        "expense",
        {
            expense_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            expense_info: {
                type: Sequelize.STRING,
                allowNull: false
            },
            expense_date: {
                type: Sequelize.STRING,
                allowNull: false
            },
            expense_amount: {
                type: Sequelize.STRING,
                allowNull: false
            }
        },
        {
            timestamps: false,
            freezeTableName: true
        }
    );
}; 
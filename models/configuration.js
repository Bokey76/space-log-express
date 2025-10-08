module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        "configuration",
        {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                comment: "id",
              },
              label: {
                type: DataTypes.STRING(255),
                allowNull: false,
                comment: "标签",
              },
              content: {
                type: DataTypes.JSON,
                allowNull: false,
                comment: "内容",
              },
              type: {
                type: DataTypes.STRING(150),
                allowNull: false,
                comment: "数据类型",
              },
        },
        {
            sequelize,
            tableName: "configuration",
            timestamps: false, // 禁用时间戳
            indexes: [
                {
                  name: "PRIMARY",
                  unique: true,
                  using: "BTREE",
                  fields: [{ name: "id" }],
                },
              ],
        }
    )
}
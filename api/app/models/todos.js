'use strict';

module.exports = (sequelize, DataTypes) => {
  const todos = sequelize.define('todos', {
    title: DataTypes.STRING,
    status: DataTypes.BOOLEAN
  }, {});
  todos.associate = function(models) {
      todos.belongsTo(models.user, {foreignKey:'userId'});

  };
  return todos;
};
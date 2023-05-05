const User = require('./User');
const Pet = require('./Pet');

User.hasMany(Pet, {
    foreignKey: 'user_id'
});

Pet.belongsTo(User);

module.exports = {
    User,
    Pet
}
const User = require('./User');
const Pet = require('./Pet');
const File = require('./File');

User.hasMany(Pet, {
    foreignKey: 'user_id'
});

Pet.belongsTo(User);

Pet.hasMany(File, {
    foreignKey: 'owner_id'
});

File.belongsTo(Pet);

module.exports = {
    User,
    Pet,
    File
}
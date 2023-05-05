const userData = require('./userData.json');
const petData = require('./petData.json');

const { Pet, User } = require('../models');

const sequelize = require('../config/connection');

const seedDatabase = async () => {
    await sequelize.sync({ force: true });
    console.log('\n----- DATABASE SYNCED -----\n');

    const users = await User.bulkCreate(userData, {
        individualHooks: true,
        returning: true,
    });
    console.log('\n----- USERS SEEDED -----\n');

    for (const pet of petData) {
        await Pet.create({
            ...pet,
            user_id: users[Math.floor(Math.random() * users.length)].id,
        });
    }
    console.log('\n----- PETS SEEDED -----\n');

    process.exit(0);
};

seedDatabase();
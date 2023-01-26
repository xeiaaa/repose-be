const mongoose = require('mongoose');
const config = require('../src/config/config');
const logger = require('../src/config/logger');
const { User } = require('../src/models');

const users = require('./data/users.json');

const importData = async () => {
  await User.create(users);
};

const deleteData = async () => {
  // Remove Users
  await User.deleteMany({});
};

(async () => {
  try {
    await mongoose.connect(config.mongoose.url, config.mongoose.options);

    if (process.argv[2] === '--import') {
      await importData();
    } else if (process.argv[2] === '--delete') {
      await deleteData();
    }

    process.exit(0);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
})();

const db = require('../../data/dbConfig');

function findByUsername(username) {
  return db('users').where({ username }).first();
}

function add(user) {
  return db('users').insert(user).then(([id]) => ({ id, ...user }));
}

module.exports = {
  findByUsername,
  add,
};

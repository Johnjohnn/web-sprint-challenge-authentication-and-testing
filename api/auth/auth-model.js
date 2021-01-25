const db = require("../../data/dbConfig");

async function addUser(user) {
    const [id] = await db("users").insert(user)
    return findUserById(id);
}

function findUsers() {
    return db("users")
    .select("users.id", "users.username")
}

function findUserById(id) {
    return db("users")
        .where("id", id)
    .first("users.id", "users.username as User")
}

function findByUsername(username) {
    return db("users")
        .where("users.username", username)
    .select("users.id", "users.username", "users.password")
}

module.exports = {
    addUser,
    findUsers,
    findUserById,
    findByUsername,

}
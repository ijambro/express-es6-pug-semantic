const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || "5432",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

console.log("Using DB config from process.env: ", dbConfig);

const { Pool } = require("pg");
const pool = new Pool(dbConfig);

const expressSession = require("express-session");
const pgSession = require("connect-pg-simple")(expressSession);

const sessionStore = new pgSession({
  pool: pool,
  createTableIfMissing: true
});

const REGISTER_ACTIVITY = "register";
const LOGIN_ACTIVITY = "login";
const LOGOUT_ACTIVITY = "logout";

async function query(query, params) {
  console.log("Performing DB query: ", query); // params may include passwords, and are not logged
  const { rows, fields } = await pool.query(query, params);
  return rows;
}

async function getUsers() {
  return query("SELECT * FROM users");
}

async function validateLogin(email, password) {
  return query(
    "SELECT * FROM users WHERE email = $1 AND password_hash = crypt($2, password_hash)",
    [email, password]
  );
}

async function createUser(firstName, lastName, email, password) {
  return query(
    "INSERT INTO users (first_name, last_name, email, password_hash) VALUES($1, $2, $3, crypt($4, gen_salt('bf'))) RETURNING *",
    [firstName, lastName, email, password]
  );
}

async function recordRegisterActivity(userId) {
  return query(
    "INSERT INTO user_activity (user_id, activity_type) VALUES ($1, $2)",
    [userId, REGISTER_ACTIVITY]
  );
}

async function recordLoginActivity(userId) {
  return query(
    "INSERT INTO user_activity (user_id, activity_type) VALUES ($1, $2)",
    [userId, LOGIN_ACTIVITY]
  );
}

async function recordLogoutActivity(userId) {
  return query(
    "INSERT INTO user_activity (user_id, activity_type) VALUES ($1, $2)",
    [userId, LOGOUT_ACTIVITY]
  );
}

module.exports = {
  sessionStore,
  REGISTER_ACTIVITY,
  LOGIN_ACTIVITY,
  LOGOUT_ACTIVITY,
  getUsers,
  validateLogin,
  createUser,
  recordRegisterActivity,
  recordLoginActivity,
  recordLogoutActivity
};

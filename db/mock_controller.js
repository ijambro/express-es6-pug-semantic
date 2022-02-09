export const REGISTER_ACTIVITY = "register";
export const LOGIN_ACTIVITY = "login";
export const LOGOUT_ACTIVITY = "logout";

const MOCK_USERS = [
  {
    id: 1,
    first_name: "Jake",
    last_name: "Palmer",
    email: "ijambro@gmail.com",
    password: "test"
  }
];

export async function getUsers() {
  return MOCK_USERS;
}

export async function validateLogin(email, password) {
  return MOCK_USERS;
}

export async function createUser(firstName, lastName, email, password) {
  return MOCK_USERS;
}

export async function recordRegisterActivity(userId) {}

export async function recordLoginActivity(userId) {}

export async function recordLogoutActivity(userId) {}

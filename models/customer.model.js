const db = require("./db");
const schema = "customers";

const CustomerModel = {
  add: async (email, username, password) => {
    try {
      const customer = await db.get(schema, "email", email);
      if (customer) {
        return {
          status: false,
          msg: `User with ${email} email is already exists`,
        };
      }
      await db.add(schema, {
        email: email,
        username: username,
        password: password,
      });
      return { status: true, msg: `User created successfully` };
    } catch (err) {
      console.error(err);
    }
  },
  addSocial: async (
    given_name,
    family_name,
    email,
    picture,
    provider,
    socialId
  ) => {
    try {
      await db.add(schema, {
        email: email,
        username: given_name, // Assuming 'given_name' is the username
        password: socialId, // Assuming 'socialId' is the password
      });
      return { status: true, msg: `User created successfully` };
    } catch (err) {
      console.error(err);
    }
  },
  get: async (email) => {
    try {
      const customer = await db.get(schema, "email", email);
      return customer;
    } catch (err) {
      console.error(err);
    }
  },
  getSocial: async (socialId) => {
    try {
      const customer = await db.get(schema, "password", socialId);
      return customer;
    } catch (err) {
      console.error(err);
    }
  },
  getAll: async () => {
    try {
      const customers = await db.getAll(schema);
      return customers;
    } catch (err) {
      console.error(err);
    }
  },
  update: async (email, updateData) => {
    try {
      updateData.last_updated = new Date();
      const result = await db.update(schema, "email", email, updateData);
      return result;
    } catch (err) {
      console.error(err);
    }
  },
};

module.exports = CustomerModel;

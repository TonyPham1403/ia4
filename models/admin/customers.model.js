const db = require('../db');

const schema = 'customers';

const CustomersModel = {
  add: async (googleAccount, username, password) => {
    try {
      const customer = await db.get('googleaccount', googleAccount);
      if (customer) {
        return {
          status: false,
          msg: `User with ${googleAccount} Google account is already exists`,
        };
      }
      await db.add(schema, { googleaccount: googleAccount, username, password });
      return { status: true, msg: `User create successfully` };
    } catch (error) {
      console.error(error);
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

  getAllWithAddresses: async () => {
    try {
      // Thêm logic để thực hiện việc lookup với danh sách địa chỉ
      const pipeline = [
        {
          $lookup: {
            from: 'addresses',
            localField: 'default_address',
            foreignField: '_id',
            as: 'addressInfo',
          },
        },
        {
          $unwind: {
            path: '$addressInfo',
            preserveNullAndEmptyArrays: true,
          },
        },
      ];

      const customersWithAddresses = await db.aggregate(schema, pipeline);
      console.log(customersWithAddresses);
      return customersWithAddresses;
    } catch (err) {
      console.error(err);
    }
  },

  getById: async (customerId) => {
    try {
      return await db.get(schema, '_id', customerId);
    } catch (error) {
      console.error(error);
    }
  },

  deleteById: async (customerId) => {
    try {
      return await db.deleteById(schema, customerId);
    } catch (error) {
      console.error(error);
    }
  },

  updateById: async (customerId, data) => {
    try {
      return await db.updateById(schema, customerId, data);
    } catch (error) {
      console.error(error);
    }
  },
};

module.exports = CustomersModel;

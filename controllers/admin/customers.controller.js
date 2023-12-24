const CustomerModel = require("../../models/admin/customers.model");
const AddressesModel = require("../../models/customer/addresses.model");

const customerController = {
  getAll: async (req, res, next) => {
    try {
      const users = await CustomerModel.getAllWithAddresses();
      const sanitizedUsers = users.map((user) => {
        return {
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          email: user.email || "",
          phone: user.phone || "",
          default_payment: user.default_payment || "",
          default_address: user.default_address
            ? `${user.addressInfo.name}\n${user.addressInfo.phone}\n${user.addressInfo.address}`
            : "No default address",
          created_at: user.created_at || "",
          last_updated: user.last_updated || "",
          _id: user._id || "",
        };
      });

      res.render("dashboard/customers", {
        title: "Customers",
        layout: "admin",
        users: sanitizedUsers,
      });
    } catch (error) {
      next(err);
    }
  },
  update: async (req, res, next) => {
    try {
      const customerId = req.params.id;
      await CustomerModel.updateById(customerId, req.body);
      res.redirect(`/admin/customers/${customerId}`);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const customerId = req.params.id;
      await CustomerModel.deleteById(customerId);
      res.redirect("/admin/customers");
    } catch (error) {
      next(error);
    }
  },

  addAddress: async (req, res, next) => {
    try {
      const data = { customer_id: req.params.id, ...req.body };
      const address = await AddressesModel.add(data);
      if (req.body.defaultAddress === "on") {
        await AddressesModel.changeDefault(req.params.id, address._id);
      }
      res.redirect(`/admin/customers/${req.params.id}`);
    } catch (error) {
      next(err);
    }
  },
  deleteAddress: async (req, res, next) => {
    try {
      await AddressesModel.delete(req.params.id, req.params.aid);
      res.redirect(`/admin/customers/${req.params.id}`);
    } catch (error) {
      next(err);
    }
  },
  updateAddress: async (req, res, next) => {
    try {
      if (req.body.defaultAddress == "on") {
        await AddressesModel.changeDefault(req.params.id, req.params.aid);
      }
      await AddressesModel.update(req.params.id, req.params.aid, req.body);
      res.redirect(`/admin/customers/${req.params.id}`);
    } catch (error) {
      next(err);
    }
  },
  makeDefaultAddress: async (req, res, next) => {
    try {
      if (req.body.address == "on")
        await AddressesModel.changeDefault(req.params.id, req.params.aid);
      res.redirect(`/admin/customers/${req.params.id}`);
    } catch (error) {
      next(err);
    }
  },
  getByEmail: async (req, res, next) => {
    try {
      const email = req.params.email; // Assuming email is part of the URL params
      const user = await CustomerModel.get(email);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const sanitizedUser = {
        // Your mapping logic for a single user
      };

      res.json(sanitizedUser);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = customerController;

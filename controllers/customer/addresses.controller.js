const AddressModel = require("../../models/customer/addresses.model");

const addressController = {
  getAddressesPage: async (req, res, next) => {
    try {
      if (req.session.user) {
        let addresses = await AddressModel.getAll(req.session.user._id);
        const defaultAddressId = req.session.user.default_address;

        addresses = addresses.map((address) => ({
          ...address._doc,
          default: address._id == defaultAddressId,
        }));

        addresses = res.render("customers/addresses", {
          title: "Addresses Book",
          _id: req.session.user._id,
          addresses: addresses,
        });
      } else res.redirect("/auth/login");
    } catch (error) {
      next(err);
    }
  },
  add: async (req, res, next) => {
    try {
      if (req.session.user) {
        const data = { customer_id: req.params.uid, ...req.body };
        const address = await AddressModel.add(data);
        if (req.body.defaultAddress === "on") {
          req.session.user = {
            ...req.session.user,
            default_address: address._id,
          };
          await AddressModel.changeDefault(req.params.uid, address._id);
        }
        res.redirect("/auth/profile/addresses");
      } else res.redirect("/auth/login");
    } catch (error) {
      next(err);
    }
  },
  delete: async (req, res, next) => {
    try {
      if (req.session.user) {
        await AddressModel.delete(req.params.uid, req.params.id);
        res.redirect("/auth/profile/addresses");
      } else res.redirect("/auth/login");
    } catch (error) {
      next(err);
    }
  },
  update: async (req, res, next) => {
    try {
      if (req.session.user) {
        if (req.body.defaultAddress == "on") {
          req.session.user = {
            ...req.session.user,
            default_address: req.params.id,
          };
          await AddressModel.changeDefault(req.params.uid, req.params.id);
        }
        await AddressModel.update(req.params.uid, req.params.id, req.body);
        res.redirect("/auth/profile/addresses");
      } else res.redirect("/auth/login");
    } catch (error) {
      next(err);
    }
  },
};

module.exports = addressController;

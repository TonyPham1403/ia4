const CustomerModel = require("../models/customer.model");
const SubscriberModel = require("../models/subscriber.model");

const adminController = {
  getAdminProfile: async (req, res, next) => {
    try {
      res.render("dashboard/admin/profile", {
        title: "Admin Profile",
        layout: "admin",
        admin: req.user,
      });
    } catch (error) {
      next(err);
    }
  },
  getLoginAdmin: async (req, res, next) => {
    try {
      if (req.isAuthenticated()) {
        res.redirect("/admin/dashboard");
      }
      res.render("dashboard/login", {
        title: "Admin Login",
        layout: "base",
      });
    } catch (error) {
      next(err);
    }
  },
  getAdminDashboard: async (req, res, next) => {
    try {
      res.render("dashboard/dashboards", {
        title: "Admin Dashboard",
        layout: "admin",
      });
    } catch (error) {
      next(err);
    }
  },
  getSubscribers: async (req, res, next) => {
    try {
      const subscribers = await SubscriberModel.getAll();
      const sanitizedSubscribers = subscribers.map((subscriber) => {
        return {
          email: subscriber.email || "",
          created_at: subscriber.created_at.toLocaleString(),
        };
      });

      res.render("dashboard/subscribers", {
        title: "Subscribers",
        layout: "admin",
        subscribers: sanitizedSubscribers,
      });
    } catch (error) {
      next(err);
    }
  },
  logOut: async (req, res, next) => {
    try {
      req.logout((err) => {
        if (err) {
          return next(err);
        }
        // Successful logout: Perform any additional tasks like clearing session data, etc. if needed
        req.locals = {};
        res.redirect("/admin");
      });
    } catch (err) {
      next(err);
    }
  },
  getReviews: async (req, res, next) => {
    try {
      res.render("dashboard/reviews", {
        title: "Reviews",
        layout: "admin",
        reviews: [],
      });
    } catch (error) {
      next(err);
    }
  },
};
module.exports = adminController;

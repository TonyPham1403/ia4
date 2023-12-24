
const homeController = {
    show: async (req, res, next) => {
        try {
            res.render('home', {
                title: 'Home',
                success: req.flash('success'),
                error: req.flash('error'),
            });
        } catch (error) {
            next(error);
        }
    },
};

module.exports = homeController;

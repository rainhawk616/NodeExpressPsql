var models = require("../models/");

module.exports = {
    registerRoutes: function (app, passportConfig) {
        app.get('/user/dashboard', passportConfig.isAuthenticated, this.dashboard);
        app.post('/user/create', this.create);
        app.get('/user/:user_id/destroy', this.destroy);
        app.post('/user/:user_id/tasks/create', this.createtask);
        app.get('/user/:user_id/tasks/:task_id/destroy', this.destroytask);
    },
    dashboard: function (req, res, next) {
        res.render('user/dashboard', {title: 'Dashboard'});
    },
    /**
     * TODO remove these calls, they are for testing psql
     */
    create: function (req, res, next) {
        models.User.create({
            firstname: req.body.username,
            lastname: req.body.username,
            email: req.body.username
        }).then(function () {
            res.redirect('/');
        });
    },
    destroy: function (req, res, next) {
        models.User.destroy({
            where: {
                userid: req.params.user_id
            }
        }).then(function () {
            res.redirect('/');
        });
    },
    createtask: function (req, res, next) {
        models.Task.create({
            title: req.body.title,
            userid: req.params.user_id
        }).then(function () {
            res.redirect('/');
        });
    },
    destroytask: function (req, res, next) {
        models.Task.destroy({
            where: {
                taskid: req.params.task_id
            }
        }).then(function () {
            res.redirect('/');
        });
    }
};
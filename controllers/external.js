var models = require('../models');
var express = require('express');
var passport = require('passport');

module.exports = {
    registerRoutes: function (app) {
        app.get('/', this.index);
        app.get('/about', this.about);
        app.get('/contact', this.contact);
        app.get('/login', this.login);
        app.post('/login', this.postlogin);
        app.get('/signup', this.signup);
        app.post('/signup', this.postsignup);
    },
    index: function (req, res, next) {
        models.User.findAll({
            include: [models.Task]
        }).then(function (users) {
            res.render('index', {
                title: 'Index',
                users: users
            });
        });
    },
    about: function (req, res, next) {
        res.render('about', {title: 'About'});
    },
    contact: function (req, res, next) {
        res.render('contact', {title: 'Contact'});
    },
    login: function (req, res, next) {
        res.render('login', {title: 'Login'});
    },
    postlogin: function (req, res, next) {
        req.assert('email', 'Email is not valid').isEmail();
        req.assert('password', 'Password cannot be blank').notEmpty();
        req.sanitize('email').normalizeEmail({remove_dots: false});

        var errors = req.validationErrors();

        if (errors) {
            req.flash('errors', errors);
            return res.redirect('/login');
        }

        passport.authenticate('local', function (err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                req.flash('errors', info);
                return res.redirect('/login');
            }
            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }
                req.flash('success', {msg: 'Success! You are logged in.'});
                res.redirect(req.session.returnTo || '/');
            });
        })(req, res, next);
    },
    signup: function (req, res, next) {
        res.render('signup', {title: 'Sign Up'});
    },
    postsignup: function (req, res, next) {
        req.check('email', 'Email is not valid').isEmail();
        req.check('password', 'Password must be at least 4 characters long').len(4);
        req.check('confirmPassword', 'Passwords do not match').equals(req.body.password);
        req.sanitize('email').normalizeEmail({remove_dots: false});

        var errors = req.validationErrors();

        if (errors) {
            req.flash('errors', errors);
            return res.redirect('/signup');
        }

        models.User.findOne({
            where: {email: req.body.email}
        }).then(function (user) {
            if (user) {
                req.flash('errors', {msg: 'Account with that email address already exists.'});
                return res.redirect('/signup');
            }
            else {
                models.User.create({
                    email: req.body.email,
                    password: req.body.password,
                    tos: req.body.tos
                }).then(function () {
                    res.redirect('/user/dashboard');
                });
            }
        });
    }
};
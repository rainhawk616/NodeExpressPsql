var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var models = require('../models');

passport.serializeUser(function(user, done) {
    done(null, user.userid);
});

passport.deserializeUser(function(id, done) {
    models.User.findOne({
        where: {
            'userid': userid
        }
    }).then(function (user) {
        if (user == null) {
            done(new Error('Wrong userid.'));
        }

        done(null, user);
    })
});

/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: 'email' }, function(email, password, done) {
    models.User.findOne({ email: email.toLowerCase() }, function(err, user) {
        if (!user) {
            return done(null, false, { msg: 'Email ' + email + ' not found.' });
        }
        user.comparePassword(password, function(err, isMatch) {
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { msg: 'Invalid email or password.' });
            }
        });
    });
}));

/**
 * Login Required middleware.
 */
exports.isAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};

/**
 * Authorization Required middleware.
 */
exports.isAuthorized = function(req, res, next) {
    var provider = req.path.split('/').slice(-1)[0];

    if (_.find(req.user.tokens, { kind: provider })) {
        next();
    } else {
        res.redirect('/auth/' + provider);
    }
};

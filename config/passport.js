const passport = require('passport');
const bcrypt = require('bcrypt');
const {Strategy: LocalStrategy} = require('passport-local');

const user = {
    username: 'test-user',
    passwordHash: 'bcrypt-hashed-password',
    id: 1
};

function findUser(username, f) {
    f();
    return user;
}

passport.use(new LocalStrategy(
    {
        usernameField: 'email'
    }, (username, password, done) => {
        findUser(username, (err, user) => {
            if (err) {
                return done(err)
            }

            // User not found
            if (!user) {
                return done(null, false)
            }

            // Always use hashed passwords and fixed time comparison
            bcrypt.compare(password, user.passwordHash, (err, isValid) => {
                if (err) {
                    return done(err)
                }
                if (!isValid) {
                    return done(null, false)
                }
                return done(null, user)
            })
        })
    }
));

/**
 * Login Required middleware.
 */
module.exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};

// /**
//  * Authorization Required middleware.
//  */
// module.exports.isAuthorized = (req, res, next) => {
//     const provider = req.path.split('/').slice(-1)[0];
//     const token = req.user.tokens.find(token => token.kind === provider);
//     if (token) {
//         next();
//     } else {
//         res.redirect(`/auth/${provider}`);
//     }
// };

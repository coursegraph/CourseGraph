const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {type: String, unique: true},
  password: String,

  profile: {
    courses: Array,
  },
}, {timestamps: true});

/**
 * Password hash middleware.
 */
userSchema.pre('save', (next) => {
  const user = this;
  // if (!user.isModified('password')) {
  //   return next();
  // }

  return bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    return bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) {
        return next(err);
      }

      user.password = hash;
      return next();
    });
  });
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = (candidatePassword, cb) => {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;

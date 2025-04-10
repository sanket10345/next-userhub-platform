const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user: { type: String, required: true, unique: true },
  interest: { type: [String], required: true },
  age: { type: Number, required: true },
  mobile: { type: Number, required: true, unique: true },
  email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
});

// Only remove __v from JSON output
userSchema.set('toJSON', {
    versionKey: false,
  });

module.exports = mongoose.model('User', userSchema);

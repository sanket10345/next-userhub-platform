const express = require('express');
const User = require('./utils/UserModel');
const { userSchema, updateUserSchema} = require('./utils/userValidator');
const router = express.Router();

// Helper: Validate uniqueness
const checkUniqueness = async (body, id = null) => {
  const query = {
    $or: [
      { user: body.user },
      { email: body.email },
      { mobile: body.mobile },
    ],
  };
  if (id) query._id = { $ne: id };
  return await User.findOne(query);
};

router.get('/', async (req, res) => {
  console.log('Log-----------------------------')
  const users = await User.find();
  res.json(users);
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  const { error } = userSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const exists = await checkUniqueness(req.body);
  if (exists) return res.status(409).json({ message: 'User with same name, email, or mobile already exists' });

  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create user' });
  }
});

router.put('/:id', async (req, res) => {
  const { error } = updateUserSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const exists = await checkUniqueness(req.body, req.params.id);
  if (exists) return res.status(409).json({ message: 'Another user with same name, email, or mobile exists' });

  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

module.exports = router;
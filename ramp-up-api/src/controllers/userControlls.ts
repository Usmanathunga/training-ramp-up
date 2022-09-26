import { User } from '../entity/User';
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcrypt');
const saltRounds = 10;
//import { loginUser } from '../service/userService';

export const postUser = async (req, res) => {
  console.log(req.body);

  const accessToken = jwt.sign(
    req.body.email,
    process.env.ACCESS_TOKEN_SECRET,
    // { expiresIn: '10s' },
  );

  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(req.body.password, salt);
  const { name, email } = req.body;
  const user = User.create({
    name: name,
    email: email,
    password: hash,
  });
  try {
    await user.save();
    return res.json({ accessToken: accessToken });
  } catch (e) {
    console.log(e);
  }

  //return res.status(200);
};

export const getUser = async (req, res) => {
  try {
    const user = await User.find();
    console.log(user);
    res.send(user);
  } catch (e) {
    console.log(e);
  }
};

export const findUser = async (req, res) => {
  console.log('parmsData', req.query);
  const accessToken = jwt.sign(
    req.query.email,
    process.env.ACCESS_TOKEN_SECRET,
    // { expiresIn: '10s' },
  );
  const user = await User.findOneBy({ email: req.query.email });
  console.log('UserDetails', user);
  if (user) {
    const value = await bcrypt.compare(req.query.password, user.password);
    console.log(value);
    if (value) {
      console.log('token', accessToken);
      return res.send({ user: user, accessToken: accessToken });
    } else {
      console.log('User not here');
    }
  } else {
    console.log('User not here');
  }
};

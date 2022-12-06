import express from 'express';
import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  name: { type: String, requierd: true, maxlength: 255 },
  email: { type: String, requierd: true, maxlength: 255 },
  password: { type: String, requierd: true, maxlength: 255 },
  isAdmin: { type: Boolean, default: false },
});

const User = mongoose.model('User', userSchema);

export default User;

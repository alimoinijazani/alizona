import express from 'express';
import mongoose from 'mongoose';
const userSchema = new mongoose.Schema(
  {
    name: { type: String, requierd: true, maxlength: 255 },
    email: { type: String, requierd: true, unique: true, maxlength: 255 },
    password: { type: String, requierd: true, maxlength: 255 },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;

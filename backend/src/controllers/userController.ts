import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { IUser, UserModel } from '../models/User';
import { checkRecaptchaValidation } from '../middleware/recaptcha';

export const registerUser = async (req: Request, res: Response) => {
  try {
    // Check reCAPTCHA validation
    if (!checkRecaptchaValidation(req)) {
      return res.status(400).json({ error: 'reCAPTCHA validation failed' });
    }

    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    const userExists = await UserModel.findByEmail(email);
    if (userExists) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const newUser: IUser = { email, password, name };
    const createdUser = await UserModel.createUser(newUser);

    if (createdUser && createdUser.id) {
      const token = jwt.sign(
        { id: createdUser.id },
        process.env.JWT_SECRET || 'your_jwt_secret_key_here',
        { expiresIn: '7d' }
      );
      res.status(201).json({ user: createdUser, token });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Error creating user' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    // Check reCAPTCHA validation
    if (!checkRecaptchaValidation(req)) {
      return res.status(400).json({ error: 'reCAPTCHA validation failed' });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    const user = await UserModel.findByEmail(email);

    if (user && (await UserModel.comparePassword(password, user.password))) {
      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET || 'your_jwt_secret_key_here',
        { expiresIn: '7d' }
      );
      res.json({ user, token });
    } else {
      res.status(400).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Error logging in' });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    if (req.user) {
      const user = await UserModel.findById(req.user.id);
      if (user) {
        res.json({
          name: user.name,
        });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } else {
      res.status(401).json({ message: 'Not authorized' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Error fetching profile' });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    const result = await UserModel.updateUserName(req.user.id, name);
    if (result) {
      res.json({ message: 'Profile updated', name });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Error updating profile' });
  }
}; 
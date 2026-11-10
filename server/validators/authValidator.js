import { z } from 'zod';

const email = z
  .string()
  .trim()
  .toLowerCase()
  .email('Please enter a valid email address');

const password = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password is too long');

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80),
  email,
  phone: z
    .string()
    .trim()
    .regex(/^[+]?[0-9\s\-()]{7,15}$/, 'Invalid phone number')
    .optional()
    .or(z.literal('')),
  password,
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(32, 'Invalid token'),
  password,
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z
    .string()
    .trim()
    .regex(/^[+]?[0-9\s\-()]{7,15}$/, 'Invalid phone number')
    .optional()
    .or(z.literal('')),
});
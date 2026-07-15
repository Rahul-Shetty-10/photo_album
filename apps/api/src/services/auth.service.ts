import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { config } from "../config";
import { createUser, findUserByEmail, findUserById } from "../repositories/user.repository";
import type { LoginInput, RegisterInput } from "../validators/auth.schema";
import { AppError } from "../utils/app-error";

const passwordSaltRounds = 12;

type AuthUser = {
  id: string;
  email: string;
  createdAt: Date;
};

type JwtPayload = {
  sub: string;
  email: string;
};

const toAuthUser = (user: { createdAt: Date; email: string; id: string }): AuthUser => ({
  id: user.id,
  email: user.email,
  createdAt: user.createdAt,
});

const signToken = (user: AuthUser) =>
  jwt.sign(
    {
      email: user.email,
    },
    config.jwtSecret,
    {
      subject: user.id,
    },
  );

export const registerUser = async (input: RegisterInput) => {
  const existingUser = await findUserByEmail(input.email);

  if (existingUser) {
    throw new AppError("An account with this email already exists", 409);
  }

  const passwordHash = await bcrypt.hash(input.password, passwordSaltRounds);
  const user = toAuthUser(await createUser({ email: input.email, passwordHash }));

  return {
    token: signToken(user),
    user,
  };
};

export const loginUser = async (input: LoginInput) => {
  const user = await findUserByEmail(input.email);
  const invalidCredentialsError = new AppError("Invalid email or password", 401);

  if (!user) {
    throw invalidCredentialsError;
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);

  if (!isPasswordValid) {
    throw invalidCredentialsError;
  }

  const authUser = toAuthUser(user);

  return {
    token: signToken(authUser),
    user: authUser,
  };
};

export const verifyAuthToken = async (token: string) => {
  try {
    const payload = jwt.verify(token, config.jwtSecret) as JwtPayload;

    if (!payload.sub) {
      throw new AppError("Invalid authentication token", 401);
    }

    const user = await findUserById(payload.sub);

    if (!user) {
      throw new AppError("Invalid authentication token", 401);
    }

    return toAuthUser(user);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("Invalid or expired authentication token", 401);
  }
};

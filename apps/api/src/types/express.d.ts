declare global {
  namespace Express {
    interface Request {
      requestId: string;
      user?: {
        createdAt: Date;
        email: string;
        id: string;
      };
    }
  }
}

export {};

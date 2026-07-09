import type { Request, Response } from "express";

import { getHealthStatus } from "../services/health.service";

export const getHealth = async (_request: Request, response: Response) => {
  response.status(200).json(await getHealthStatus());
};

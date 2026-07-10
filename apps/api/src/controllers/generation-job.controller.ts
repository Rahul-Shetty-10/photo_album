import type { Request, Response } from "express";

import { createPendingGenerationJob, getGenerationJobStatus } from "../services/generation-job.service";
import { AppError } from "../utils/app-error";

export const createGenerationJob = async (request: Request, response: Response) => {
  const job = await createPendingGenerationJob(request.body);

  response.status(201).json(job);
};

export const getGenerationJob = async (request: Request, response: Response) => {
  const { id } = request.params;

  if (Array.isArray(id)) {
    throw new AppError("Invalid generation job id", 400);
  }

  const job = await getGenerationJobStatus(id);

  response.status(200).json(job);
};

export const getGenerationJobStatusById = getGenerationJob;

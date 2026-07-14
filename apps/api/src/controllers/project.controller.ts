import type { Request, Response } from "express";

import {
  archiveUserProject,
  createUserProject,
  deleteUserProject,
  getUserProject,
  getUserProjects,
  renameUserProject,
} from "../services/project.service";
import { AppError } from "../utils/app-error";

export const createProject = async (request: Request, response: Response) => {
  const project = await createUserProject(getRequestUserId(request), request.body);

  response.status(201).json({ project });
};

export const listProjects = async (request: Request, response: Response) => {
  const projects = await getUserProjects(getRequestUserId(request));

  response.status(200).json({ projects });
};

export const getProject = async (request: Request, response: Response) => {
  const project = await getUserProject(getRequestUserId(request), getProjectId(request));

  response.setHeader("Cache-Control", "no-store");
  response.status(200).json({ project });
};

export const renameProject = async (request: Request, response: Response) => {
  const project = await renameUserProject(getRequestUserId(request), getProjectId(request), request.body);

  response.status(200).json({ project });
};

export const archiveProject = async (request: Request, response: Response) => {
  const project = await archiveUserProject(getRequestUserId(request), getProjectId(request));

  response.status(200).json({ project });
};

export const deleteProject = async (request: Request, response: Response) => {
  await deleteUserProject(getRequestUserId(request), getProjectId(request));

  response.status(204).send();
};

const getRequestUserId = (request: Request) => {
  if (!request.user) {
    throw new AppError("Authentication required", 401);
  }

  return request.user.id;
};

const getProjectId = (request: Request) => {
  const { id } = request.params;

  if (typeof id !== "string") {
    throw new AppError("Invalid project id", 400);
  }

  return id;
};

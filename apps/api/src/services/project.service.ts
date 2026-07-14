import {
  createProject,
  deleteProjectById,
  findProjectById,
  findProjectsByUserId,
  renameProject,
  updateProjectStatus,
} from "../repositories/project.repository";
import { AppError } from "../utils/app-error";
import { createProjectSchema, renameProjectSchema } from "../validators/project.schema";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const createUserProject = async (userId: string, input: unknown) => {
  const payload = createProjectSchema.parse(input);
  const project = await createProject({ ...payload, userId });

  return serializeProject(project);
};

export const getUserProjects = async (userId: string) => {
  const projects = await findProjectsByUserId(userId);

  if (!Array.isArray(projects) || projects.length === 0) {
    return [];
  }

  return projects.map(serializeProject);
};

export const getUserProject = async (userId: string, projectId: string) => {
  const project = await findOwnedProject(userId, projectId);

  return serializeProject(project);
};

export const renameUserProject = async (userId: string, projectId: string, input: unknown) => {
  await findOwnedProject(userId, projectId);

  const payload = renameProjectSchema.parse(input);
  const project = await renameProject(projectId, payload.name);

  return serializeProject(project);
};

export const archiveUserProject = async (userId: string, projectId: string) => {
  await findOwnedProject(userId, projectId);

  const project = await updateProjectStatus(projectId, "ARCHIVED");

  return serializeProject(project);
};

export const deleteUserProject = async (userId: string, projectId: string) => {
  await findOwnedProject(userId, projectId);
  await deleteProjectById(projectId);
};

const findOwnedProject = async (userId: string, projectId: string) => {
  if (!uuidPattern.test(projectId)) {
    throw new AppError("Invalid project id", 400);
  }

  const project = await findProjectById(projectId);

  if (!project || project.userId !== userId) {
    throw new AppError("Project not found", 404);
  }

  return project;
};

const serializeProject = (project: {
  createdAt: Date;
  currentStep: string;
  eventCategory: string;
  id: string;
  name: string;
  status: string;
  updatedAt: Date;
  userId: string;
}) => ({
  createdAt: project.createdAt,
  currentStep: project.currentStep,
  eventCategory: project.eventCategory,
  id: project.id,
  name: project.name,
  status: project.status,
  updatedAt: project.updatedAt,
  userId: project.userId,
});

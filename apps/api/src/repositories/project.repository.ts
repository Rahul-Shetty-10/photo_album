import { Prisma, type ProjectStatus } from "@prisma/client";

import { prisma } from "../database/prisma";
import { logger } from "../utils/logger";

export const createProject = (data: { eventCategory: string; name: string; userId: string }) =>
  prisma.project.create({
    data,
  });

export const findProjectsByUserId = async (userId: string) => {
  try {
    return await prisma.project.findMany({
      where: {
        userId,
        status: {
          not: "ARCHIVED",
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  } catch (error) {
    if (isMissingProjectStorageError(error)) {
      logger.warn({ error, userId }, "Project storage is unavailable while listing projects");
      return [];
    }

    throw error;
  }
};

export const findProjectById = (id: string) =>
  prisma.project.findUnique({
    where: { id },
  });

export const renameProject = (id: string, name: string) =>
  prisma.project.update({
    data: { name },
    where: { id },
  });

export const updateProjectStatus = (id: string, status: ProjectStatus) =>
  prisma.project.update({
    data: { status },
    where: { id },
  });

export const deleteProjectById = (id: string) =>
  prisma.project.delete({
    where: { id },
  });

const isMissingProjectStorageError = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError &&
  (error.code === "P2021" || error.code === "P2022");

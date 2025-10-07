'use server';

import {
  getAllProjects as getAllProjectsQuery,
  createProject as createProjectQuery,
  updateProject as updateProjectQuery,
  deleteProject as deleteProjectQuery,
  getAllStatuses as getAllStatusesQuery,
  getAllStreams as getAllStreamsQuery,
  getAllUsers as getAllUsersQuery,
  getAllOwners as getAllOwnersQuery,
  getAllInitiatives as getAllInitiativesQuery,
  getAllReleases as getAllReleasesQuery,
} from '@/lib/db/queries';
import type { ProjectWithRelations, Status, Stream, Owner, User, Initiative, Release, Database } from '@/types/database';

/**
 * Server action to fetch all projects
 */
export async function getAllProjects(): Promise<ProjectWithRelations[]> {
  return getAllProjectsQuery();
}

/**
 * Server action to create a new project
 */
export async function createProject(
  project: Database['public']['Tables']['projects']['Insert']
): Promise<ProjectWithRelations> {
  return createProjectQuery(project);
}

/**
 * Server action to update a project
 */
export async function updateProject(
  id: string,
  updates: Database['public']['Tables']['projects']['Update']
): Promise<ProjectWithRelations> {
  return updateProjectQuery(id, updates);
}

/**
 * Server action to delete a project
 */
export async function deleteProject(id: string): Promise<void> {
  return deleteProjectQuery(id);
}

/**
 * Server action to fetch all statuses
 */
export async function getAllStatuses(): Promise<Status[]> {
  return getAllStatusesQuery();
}

/**
 * Server action to fetch all streams
 */
export async function getAllStreams(): Promise<Stream[]> {
  return getAllStreamsQuery();
}

/**
 * Server action to fetch all users
 */
export async function getAllUsers(): Promise<User[]> {
  return getAllUsersQuery();
}

/**
 * Server action to fetch all initiatives
 */
export async function getAllInitiatives(): Promise<Initiative[]> {
  return getAllInitiativesQuery();
}

/**
 * Server action to fetch all releases
 */
export async function getAllReleases(): Promise<Release[]> {
  return getAllReleasesQuery();
}

/**
 * Server action to fetch all owners
 */
export async function getAllOwners(): Promise<Owner[]> {
  return getAllOwnersQuery();
}

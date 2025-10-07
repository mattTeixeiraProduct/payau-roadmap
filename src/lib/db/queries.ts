import { createClient } from "@/lib/supabase/server";
import type {
  ProjectWithRelations,
  Status,
  Stream,
  Owner,
  Database,
} from "@/types/database";

/**
 * Fetch all projects with their relations
 */
export async function getAllProjects(): Promise<ProjectWithRelations[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select(
      `
      *,
      status:statuses(*),
      stream:streams(*),
      owner:owners(*),
      initiative:initiatives(*),
      release:releases(*)
    `
    )
    .order("start_date", { ascending: true });

  if (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }

  return data as ProjectWithRelations[];
}

/**
 * Fetch projects by stream
 */
export async function getProjectsByStream(
  streamName: string
): Promise<ProjectWithRelations[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select(
      `
      *,
      status:statuses(*),
      stream:streams(*),
      owner:owners(*),
      initiative:initiatives(*),
      release:releases(*)
    `
    )
    .eq("stream.name", streamName)
    .order("start_date", { ascending: true });

  if (error) {
    console.error("Error fetching projects by stream:", error);
    throw error;
  }

  return data as ProjectWithRelations[];
}

/**
 * Fetch projects by status
 */
export async function getProjectsByStatus(
  statusName: string
): Promise<ProjectWithRelations[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select(
      `
      *,
      status:statuses(*),
      stream:streams(*),
      owner:owners(*),
      initiative:initiatives(*),
      release:releases(*)
    `
    )
    .eq("status.name", statusName)
    .order("start_date", { ascending: true });

  if (error) {
    console.error("Error fetching projects by status:", error);
    throw error;
  }

  return data as ProjectWithRelations[];
}

/**
 * Create a new project
 */
export async function createProject(
  project: Database["public"]["Tables"]["projects"]["Insert"]
): Promise<ProjectWithRelations> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    // @ts-expect-error - Supabase type inference issue with Database generic
    .insert(project)
    .select(
      `
      *,
      status:statuses(*),
      stream:streams(*),
      owner:owners(*),
      initiative:initiatives(*),
      release:releases(*)
    `
    )
    .single();

  if (error) {
    console.error("Error creating project:", error);
    throw error;
  }

  return data as ProjectWithRelations;
}

/**
 * Update a project
 */
export async function updateProject(
  id: string,
  updates: Database["public"]["Tables"]["projects"]["Update"]
): Promise<ProjectWithRelations> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    // @ts-expect-error - Supabase type inference issue with Database generic
    .update(updates)
    .eq("id", id)
    .select(
      `
      *,
      status:statuses(*),
      stream:streams(*),
      owner:owners(*),
      initiative:initiatives(*),
      release:releases(*)
    `
    )
    .single();

  if (error) {
    console.error("Error updating project:", error);
    throw error;
  }

  return data as ProjectWithRelations;
}

/**
 * Delete a project
 */
export async function deleteProject(id: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
}

/**
 * Fetch all statuses
 */
export async function getAllStatuses(): Promise<Status[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("statuses")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching statuses:", error);
    throw error;
  }

  return data;
}

/**
 * Fetch all streams
 */
export async function getAllStreams(): Promise<Stream[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("streams")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching streams:", error);
    throw error;
  }

  return data;
}

/**
 * Fetch all users
 */
export async function getAllUsers() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching users:", error);
    throw error;
  }

  return data;
}

/**
 * Fetch all owners
 */
export async function getAllOwners(): Promise<Owner[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("owners")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching owners:", error);
    throw error;
  }

  return data;
}

/**
 * Fetch all initiatives
 */
export async function getAllInitiatives() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("initiatives")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching initiatives:", error);
    throw error;
  }

  return data;
}

/**
 * Fetch all releases
 */
export async function getAllReleases() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("releases")
    .select("*")
    .order("year", { ascending: true })
    .order("quarter", { ascending: true });

  if (error) {
    console.error("Error fetching releases:", error);
    throw error;
  }

  return data;
}

// Database types matching Supabase schema

export type Owner = {
  id: string;
  name: string;
  role: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  slack_handle: string | null;
  bio: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type Status = {
  id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
};

export type Stream = {
  id: string;
  name: string;
  color: string;
  icon: string;
  created_at: string;
  updated_at: string;
};

export type User = {
  id: string;
  name: string;
  email: string | null;
  image: string | null;
  created_at: string;
  updated_at: string;
};

export type Initiative = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type Release = {
  id: string;
  name: string;
  quarter: string | null;
  year: number | null;
  release_date: string | null;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: string;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string;
  status_id: string;
  stream_id: string;
  owner_id: string | null;
  initiative_id: string | null;
  release_id: string | null;
  progress: number;
  created_at: string;
  updated_at: string;
};

// With relations for joined queries
export type ProjectWithRelations = Project & {
  status: Status;
  stream: Stream;
  owner: Owner | null;
  initiative: Initiative | null;
  release: Release | null;
};

// Supabase Database type
export type Database = {
  public: {
    Tables: {
      owners: {
        Row: Owner;
        Insert: Omit<Owner, 'id' | 'created_at' | 'updated_at' | 'active'> & {
          active?: boolean;
        };
        Update: Partial<Omit<Owner, 'id' | 'created_at' | 'updated_at'>>;
      };
      statuses: {
        Row: Status;
        Insert: Omit<Status, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Status, 'id' | 'created_at' | 'updated_at'>>;
      };
      streams: {
        Row: Stream;
        Insert: Omit<Stream, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Stream, 'id' | 'created_at' | 'updated_at'>>;
      };
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>;
      };
      initiatives: {
        Row: Initiative;
        Insert: Omit<Initiative, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Initiative, 'id' | 'created_at' | 'updated_at'>>;
      };
      releases: {
        Row: Release;
        Insert: Omit<Release, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Release, 'id' | 'created_at' | 'updated_at'>>;
      };
      projects: {
        Row: Project;
        Insert: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'progress'> & {
          progress?: number;
        };
        Update: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
};


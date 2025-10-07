"use client";

import { useState, useEffect } from "react";
import {
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { LayoutList, Plus, CalendarIcon, DollarSign, TrendingUp, Users, Globe, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  getAllProjects,
  getAllStatuses,
  getAllStreams,
  getAllUsers,
  getAllInitiatives,
  getAllReleases,
  createProject as createProjectInDb,
  updateProject,
  deleteProject,
} from "@/lib/actions";
import type {
  ProjectWithRelations,
  Status,
  Stream,
  User,
  Initiative,
  Release,
} from "@/types/database";
import type { ColumnDef } from "@/components/ui/shadcn-io/table";
import {
  TableBody,
  TableCell,
  TableColumnHeader,
  TableHead,
  TableHeader,
  TableHeaderGroup,
  TableProvider,
  TableRow,
} from "@/components/ui/shadcn-io/table";
import { ChevronRightIcon } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

// Stream metadata for UI
const streamMetadata = [
  { name: "Payments", icon: DollarSign, color: "#3B82F6" },
  { name: "Rewards", icon: TrendingUp, color: "#A855F7" },
  { name: "Growth", icon: Users, color: "#10B981" },
  { name: "US", icon: Globe, color: "#EF4444" },
  { name: "Mobile", icon: Smartphone, color: "#F97316" },
];


// Type for feature objects used in the app
type Feature = {
  id: string;
  name: string;
  description: string;
  startAt: Date;
  endAt: Date;
  status: { id: string; name: string; color: string };
  owner: { id: string; name: string; image: string };
  group: { id: string; name: string };
  product: { id: string; name: string };
  initiative: { id: string; name: string };
  release: { id: string; name: string };
};

// Transform Supabase projects to app format
const transformProject = (project: ProjectWithRelations): Feature => ({
  id: project.id,
  name: project.name,
  description: project.description || "",
  startAt: new Date(project.start_date),
  endAt: new Date(project.end_date),
  status: {
    id: project.status.id,
    name: project.status.name,
    color: project.status.color,
  },
  owner: project.owner
    ? {
        id: project.owner.id,
        name: project.owner.name,
        image: project.owner.image || "",
      }
    : { id: "", name: "", image: "" },
  group: {
    id: project.stream.id,
    name: project.stream.name,
  },
  product: {
    id: project.stream.id,
    name: project.stream.name,
  },
  initiative: project.initiative
    ? {
        id: project.initiative.id,
        name: project.initiative.name,
      }
    : { id: "", name: "" },
  release: project.release
    ? {
        id: project.release.id,
        name: project.release.name,
      }
    : { id: "", name: "" },
});

const BacklogTableView = ({ 
  features, 
  onEditFeature,
  onDeleteFeature,
}: { 
  features: Feature[];
  onEditFeature: (id: string) => void;
  onDeleteFeature: (id: string) => void;
}) => {
  const columns: ColumnDef<Feature>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <TableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Avatar className="size-6">
                <AvatarImage src={row.original.owner.image} />
                <AvatarFallback>
                  {row.original.owner.name?.slice(0, 2)}
                </AvatarFallback>
              </Avatar>

              <div
                className="absolute right-0 bottom-0 h-2 w-2 rounded-full ring-2 ring-background"
                style={{
                  backgroundColor: row.original.status.color,
                }}
              />
            </div>
            <div>
              <span className="font-medium">{row.original.name}</span>
              <div className="flex items-center gap-1 text-muted-foreground text-xs">
                <span>{row.original.product.name}</span>
                <ChevronRightIcon size={12} />
                <span>{row.original.group.name}</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "startAt",
      header: ({ column }) => (
        <TableColumnHeader column={column} title="Start At" />
      ),
      cell: ({ row }) =>
        new Intl.DateTimeFormat("en-US", {
          dateStyle: "medium",
        }).format(row.original.startAt),
    },
    {
      accessorKey: "endAt",
      header: ({ column }) => (
        <TableColumnHeader column={column} title="End At" />
      ),
      cell: ({ row }) =>
        new Intl.DateTimeFormat("en-US", {
          dateStyle: "medium",
        }).format(row.original.endAt),
    },
    {
      id: "release",
      accessorFn: (row) => row.release.id,
      header: ({ column }) => (
        <TableColumnHeader column={column} title="Release" />
      ),
      cell: ({ row }) => row.original.release.name,
    },
  ];

  return (
    <div className="w-full h-full overflow-auto">
      <TableProvider columns={columns} data={features}>
        <TableHeader>
          {({ headerGroup }) => (
            <TableHeaderGroup headerGroup={headerGroup} key={headerGroup.id}>
              {({ header }) => <TableHead header={header} key={header.id} />}
            </TableHeaderGroup>
          )}
        </TableHeader>
        <TableBody>
          {({ row }) => {
            const feature = row.original as Feature;
            return (
              <ContextMenu key={row.id}>
                <ContextMenuTrigger asChild>
                  <div>
                    <TableRow
                      row={row}
                      className="hover:bg-muted/50"
                    >
                      {({ cell }) => <TableCell cell={cell} key={cell.id} />}
                    </TableRow>
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem
                    className="flex items-center gap-2"
                    onClick={() => onEditFeature(feature.id)}
                  >
                    Edit project
                  </ContextMenuItem>
                  <ContextMenuItem
                    className="flex items-center gap-2 text-destructive"
                    onClick={() => onDeleteFeature(feature.id)}
                  >
                    Delete project
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            );
          }}
        </TableBody>
      </TableProvider>
    </div>
  );
};

const BacklogPage = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [statusOptions, setStatusOptions] = useState<Status[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    stream: "",
    startDate: new Date(),
    endDate: new Date(),
    status: "Backlog", // Pre-set to Backlog
    description: "",
  });
  const [editProject, setEditProject] = useState({
    id: "",
    name: "",
    stream: "",
    startDate: new Date(),
    endDate: new Date(),
    status: "Backlog",
    description: "",
  });

  // Fetch backlog projects from Supabase on mount
  useEffect(() => {
    const fetchBacklogProjects = async () => {
      try {
        setLoading(true);
        const projects = await getAllProjects();
        const transformed = projects
          .map(transformProject)
          .filter((f) => f.status.name === "Backlog"); // Only show backlog projects
        setFeatures(transformed);
      } catch (error) {
        console.error("Error fetching backlog projects:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchStatuses = async () => {
      try {
        const statuses = (await getAllStatuses()) as Status[];
        setStatusOptions(statuses);
      } catch (error) {
        console.error("Error fetching statuses:", error);
      }
    };

    fetchBacklogProjects();
    fetchStatuses();
  }, []);

  const handleCreateProject = async () => {
    if (!newProject.name || !newProject.stream) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setIsCreating(true);
      // Fetch reference data to get IDs
      const results = await Promise.all([
        getAllStatuses(),
        getAllStreams(),
        getAllUsers(),
        getAllInitiatives(),
        getAllReleases(),
      ]);

      const statuses = results[0] as Status[];
      const streams = results[1] as Stream[];
      const users = results[2] as User[];
      const initiatives = results[3] as Initiative[];
      const releases = results[4] as Release[];

      const selectedStream = streams.find((s) => s.name === newProject.stream);
      const selectedStatus = statuses.find((s) => s.name === "Backlog");
      const defaultUser = users.find((u) => u.name === "Product Team");

      if (!selectedStream || !selectedStatus) {
        alert("Invalid stream or status selection");
        return;
      }

      // Determine initiative and release based on start date
      const now = new Date();
      const monthsDiff =
        (newProject.startDate.getFullYear() - now.getFullYear()) * 12 +
        newProject.startDate.getMonth() -
        now.getMonth();

      let initiative = initiatives.length > 0 ? initiatives[0] : null;
      let release = releases.length > 0 ? releases[0] : null;

      if (monthsDiff >= 3 && monthsDiff < 6) {
        initiative = initiatives.length > 1 ? initiatives[1] : initiative;
        release = releases.length > 1 ? releases[1] : release;
      } else if (monthsDiff >= 6) {
        initiative = initiatives.length > 2 ? initiatives[2] : initiative;
        release = releases.length > 2 ? releases[2] : release;
      }

      // Create project in database
      const createdProject = await createProjectInDb({
        name: newProject.name,
        description: newProject.description || null,
        start_date: newProject.startDate.toISOString().split("T")[0],
        end_date: newProject.endDate.toISOString().split("T")[0],
        status_id: selectedStatus.id,
        stream_id: selectedStream.id,
        owner_id: defaultUser?.id || null,
        initiative_id: initiative?.id || null,
        release_id: release?.id || null,
        progress: 0,
      });

      // Add to local state
      const transformed = transformProject(createdProject);
      setFeatures([...features, transformed]);

      // Reset form
      setIsDialogOpen(false);
      setNewProject({
        name: "",
        stream: "",
        startDate: new Date(),
        endDate: new Date(),
        status: "Backlog",
        description: "",
      });
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Failed to create project. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditFeature = (id: string) => {
    const feature = features.find((f) => f.id === id);
    if (feature) {
      setEditProject({
        id: feature.id,
        name: feature.name,
        stream: feature.product.name,
        startDate: feature.startAt,
        endDate: feature.endAt,
        status: feature.status.name,
        description: feature.description,
      });
      setIsEditDialogOpen(true);
    }
  };

  const handleDeleteFeature = async (id: string) => {
    if (!confirm("Are you sure you want to delete this backlog project?")) {
      return;
    }

    try {
      await deleteProject(id);
      setFeatures((prev) => prev.filter((feature) => feature.id !== id));
    } catch (error) {
      console.error("Error deleting backlog project:", error);
      alert("Failed to delete project. Please try again.");
    }
  };

  const handleUpdateProject = async () => {
    if (!editProject.name || !editProject.stream) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setIsUpdating(true);
      // Fetch reference data to get IDs
      const results = await Promise.all([
        getAllStatuses(),
        getAllStreams(),
        getAllInitiatives(),
        getAllReleases(),
      ]);

      const statuses = results[0] as Status[];
      const streams = results[1] as Stream[];
      const initiatives = results[2] as Initiative[];
      const releases = results[3] as Release[];

      const selectedStream = streams.find((s) => s.name === editProject.stream);
      const selectedStatus = statuses.find((s) => s.name === editProject.status);

      if (!selectedStream || !selectedStatus) {
        alert("Invalid stream or status selection");
        return;
      }

      // Determine initiative and release based on start date
      const now = new Date();
      const monthsDiff =
        (editProject.startDate.getFullYear() - now.getFullYear()) * 12 +
        editProject.startDate.getMonth() -
        now.getMonth();

      let initiative = initiatives.length > 0 ? initiatives[0] : null;
      let release = releases.length > 0 ? releases[0] : null;

      if (monthsDiff >= 3 && monthsDiff < 6) {
        initiative = initiatives.length > 1 ? initiatives[1] : initiative;
        release = releases.length > 1 ? releases[1] : release;
      } else if (monthsDiff >= 6) {
        initiative = initiatives.length > 2 ? initiatives[2] : initiative;
        release = releases.length > 2 ? releases[2] : release;
      }

      // Update project in database
      const updatedProject = await updateProject(editProject.id, {
        name: editProject.name,
        description: editProject.description || null,
        start_date: editProject.startDate.toISOString().split("T")[0],
        end_date: editProject.endDate.toISOString().split("T")[0],
        status_id: selectedStatus.id,
        stream_id: selectedStream.id,
        initiative_id: initiative?.id || null,
        release_id: release?.id || null,
      });

      // Update local state
      const transformed = transformProject(updatedProject);
      setFeatures(
        features.map((f) => (f.id === editProject.id ? transformed : f))
      );

      // Reset form and close dialog
      setIsEditDialogOpen(false);
      setEditProject({
        id: "",
        name: "",
        stream: "",
        startDate: new Date(),
        endDate: new Date(),
        status: "Backlog",
        description: "",
      });
    } catch (error) {
      console.error("Error updating project:", error);
      alert("Failed to update project. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <SidebarInset>
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading backlog...</p>
          </div>
        </div>
      </SidebarInset>
    );
  }

  return (
    <SidebarInset>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-4 p-4 border-b">
          <div className="flex items-center gap-1">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-6 bg-muted" />
            <div>
              <p className="font-medium">Backlog</p>
              <p className="text-xs text-muted-foreground">
                {features.length} project{features.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4" />
                Create Backlog Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Create Backlog Project</DialogTitle>
                <DialogDescription>
                  Add a new project to your backlog. Fill in all the details
                  below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Project Name *</Label>
                  <Input
                    id="name"
                    value={newProject.name}
                    onChange={(e) =>
                      setNewProject({ ...newProject, name: e.target.value })
                    }
                    placeholder="Enter project name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newProject.description}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        description: e.target.value,
                      })
                    }
                    placeholder="Enter project description"
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="stream">Stream *</Label>
                  <Select
                    value={newProject.stream}
                    onValueChange={(value) =>
                      setNewProject({ ...newProject, stream: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a stream" />
                    </SelectTrigger>
                    <SelectContent>
                      {streamMetadata.map((stream) => (
                        <SelectItem key={stream.name} value={stream.name}>
                          {stream.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Input
                    id="status"
                    value="Backlog"
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    Status is automatically set to Backlog
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label>Start Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(newProject.startDate, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newProject.startDate}
                        onSelect={(date) =>
                          date &&
                          setNewProject({ ...newProject, startDate: date })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid gap-2">
                  <Label>End Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(newProject.endDate, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newProject.endDate}
                        onSelect={(date) =>
                          date &&
                          setNewProject({ ...newProject, endDate: date })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateProject} disabled={isCreating}>
                  {isCreating ? "Working" : "Create Backlog Project"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit Project Dialog */}
          <Dialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
          >
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Edit Backlog Project</DialogTitle>
                <DialogDescription>
                  Update the project details below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Project Name *</Label>
                  <Input
                    id="edit-name"
                    value={editProject.name}
                    onChange={(e) =>
                      setEditProject({
                        ...editProject,
                        name: e.target.value,
                      })
                    }
                    placeholder="Enter project name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editProject.description}
                    onChange={(e) =>
                      setEditProject({
                        ...editProject,
                        description: e.target.value,
                      })
                    }
                    placeholder="Enter project description"
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-stream">Stream *</Label>
                  <Select
                    value={editProject.stream}
                    onValueChange={(value) =>
                      setEditProject({ ...editProject, stream: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a stream" />
                    </SelectTrigger>
                    <SelectContent>
                      {streamMetadata.map((stream) => (
                        <SelectItem key={stream.name} value={stream.name}>
                          {stream.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-status">Status *</Label>
                  <Select
                    value={editProject.status}
                    onValueChange={(value) =>
                      setEditProject({ ...editProject, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.id} value={status.name}>
                          {status.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Start Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(editProject.startDate, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={editProject.startDate}
                        onSelect={(date) =>
                          date &&
                          setEditProject({
                            ...editProject,
                            startDate: date,
                          })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid gap-2">
                  <Label>End Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(editProject.endDate, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={editProject.endDate}
                        onSelect={(date) =>
                          date &&
                          setEditProject({ ...editProject, endDate: date })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button onClick={handleUpdateProject} disabled={isUpdating}>
                  {isUpdating ? "Working" : "Update Project"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        {features.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <LayoutList className="h-16 w-16 mx-auto text-muted-foreground" />
              <div>
                <h2 className="text-2xl font-semibold mb-2">No Backlog Projects Yet</h2>
                <p className="text-muted-foreground max-w-md">
                  Create your first backlog project using the button above.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden">
            <BacklogTableView
              features={features}
              onEditFeature={handleEditFeature}
              onDeleteFeature={handleDeleteFeature}
            />
          </div>
        )}
      </div>
    </SidebarInset>
  );
};

export default BacklogPage;
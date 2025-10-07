"use client";

import {
  GanttCreateMarkerTrigger,
  GanttFeatureItem,
  GanttFeatureList,
  GanttFeatureListGroup,
  GanttHeader,
  GanttProvider,
  GanttSidebar,
  GanttSidebarGroup,
  GanttSidebarItem,
  GanttTimeline,
  GanttToday,
} from "@/components/ui/shadcn-io/gantt";
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from "@/components/ui/shadcn-io/kanban";
import {
  type DragEndEvent,
  ListGroup,
  ListHeader,
  ListItem,
  ListItems,
  ListProvider,
} from "@/components/ui/shadcn-io/list";
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
import groupBy from "lodash.groupby";
import {
  CalendarIcon,
  ChevronRightIcon,
  EyeIcon,
  GanttChartSquareIcon,
  KanbanSquareIcon,
  LinkIcon,
  ListIcon,
  TableIcon,
  TrashIcon,
  DollarSign,
  TrendingUp,
  Users,
  Globe,
  Smartphone,
  Plus,
  Pencil,
  Check,
  ChevronsUpDown,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  getAllProjects,
  createProject as createProjectInDb,
  updateProject,
  deleteProject,
  getAllStatuses,
  getAllStreams,
  getAllOwners,
  getAllUsers,
  getAllInitiatives,
  getAllReleases,
} from "@/lib/actions";
import type {
  ProjectWithRelations,
  Status,
  Stream,
  Owner,
  User,
  Initiative,
  Release,
} from "@/types/database";

// Stream definitions with their metadata (UI reference only)
const streamMetadata = [
  { name: "Payments", icon: DollarSign, color: "#3B82F6" },
  { name: "Rewards", icon: TrendingUp, color: "#A855F7" },
  { name: "Growth", icon: Users, color: "#10B981" },
  { name: "US", icon: Globe, color: "#EF4444" },
  { name: "Mobile", icon: Smartphone, color: "#F97316" },
];

// Status reference for local UI components (will be synced from DB)
const statusesRef = [
  { id: "not-started", name: "Not started", color: "#6B7280" },
  { id: "in-progress", name: "In progress", color: "#3B82F6" },
  { id: "at-risk", name: "At risk", color: "#F59E0B" },
  { id: "done", name: "Done", color: "#10B981" },
  { id: "cancelled", name: "Cancelled", color: "#EF4444" },
];

// Type for feature objects used in the app
type Feature = {
  id: string;
  name: string;
  description: string;
  startAt: Date;
  endAt: Date;
  status: { id: string; name: string; color: string };
  owner: {
    id: string;
    name: string;
    avatarUrl: string;
    role: string | null;
  };
  group: { id: string; name: string };
  product: { id: string; name: string };
  initiative: { id: string; name: string };
  release: { id: string; name: string };
};

const GanttView = ({
  features,
  setFeatures,
  onViewFeature,
  onEditFeature,
}: {
  features: Feature[];
  setFeatures: React.Dispatch<React.SetStateAction<Feature[]>>;
  onViewFeature: (id: string) => void;
  onEditFeature: (id: string) => void;
}) => {
  const groupedFeatures = groupBy(features, "group.name");

  const sortedGroupedFeatures = Object.fromEntries(
    Object.entries(groupedFeatures).sort(([nameA], [nameB]) =>
      nameA.localeCompare(nameB)
    )
  );

  const handleCopyLink = (id: string) => console.log(`Copy link: ${id}`);

  const handleRemoveFeature = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) {
      return;
    }

    try {
      // Delete from database
      await deleteProject(id);

      // Remove from local state
      setFeatures((prev) => prev.filter((feature) => feature.id !== id));
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project. Please try again.");
    }
  };

  const handleCreateMarker = (date: Date) =>
    console.log(`Create marker: ${date.toISOString()}`);

  const handleMoveFeature = (id: string, startAt: Date, endAt: Date | null) => {
    if (!endAt) {
      return;
    }

    setFeatures((prev) =>
      prev.map((feature) =>
        feature.id === id ? { ...feature, startAt, endAt } : feature
      )
    );

    console.log(`Move feature: ${id} from ${startAt} to ${endAt}`);
  };

  const handleAddFeature = (date: Date) =>
    console.log(`Add feature: ${date.toISOString()}`);

  return (
    <GanttProvider
      className="rounded-none flex-1"
      onAddItem={handleAddFeature}
      range="monthly"
      zoom={100}
    >
      <GanttSidebar>
        {Object.entries(sortedGroupedFeatures).map(([group, features]) => (
          <GanttSidebarGroup key={group} name={group}>
            {features.map((feature) => (
              <GanttSidebarItem
                feature={feature}
                key={feature.id}
                onSelectItem={(id) => console.log(`Sidebar item: ${id}`)}
              />
            ))}
          </GanttSidebarGroup>
        ))}
      </GanttSidebar>
      <GanttTimeline>
        <GanttHeader />
        <GanttFeatureList>
          {Object.entries(sortedGroupedFeatures).map(([group, features]) => (
            <GanttFeatureListGroup key={group}>
              {features.map((feature) => (
                <div className="flex" key={feature.id}>
                  <ContextMenu>
                    <ContextMenuTrigger asChild>
                      <button
                        onClick={() => onViewFeature(feature.id)}
                        type="button"
                      >
                        <GanttFeatureItem
                          onMove={handleMoveFeature}
                          {...feature}
                        >
                          <p className="flex-1 truncate text-xs">
                            {feature.name}
                          </p>
                          {feature.owner && (
                            <Avatar className="h-4 w-4">
                              <AvatarImage src={feature.owner.avatarUrl} />
                              <AvatarFallback>
                                {feature.owner.name?.slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </GanttFeatureItem>
                      </button>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem
                        className="flex items-center gap-2"
                        onClick={() => onViewFeature(feature.id)}
                      >
                        <EyeIcon className="text-muted-foreground" size={16} />
                        View feature
                      </ContextMenuItem>
                      <ContextMenuItem
                        className="flex items-center gap-2"
                        onClick={() => onEditFeature(feature.id)}
                      >
                        <Pencil className="text-muted-foreground" size={16} />
                        Edit project
                      </ContextMenuItem>
                      <ContextMenuItem
                        className="flex items-center gap-2"
                        onClick={() => handleCopyLink(feature.id)}
                      >
                        <LinkIcon className="text-muted-foreground" size={16} />
                        Copy link
                      </ContextMenuItem>
                      <ContextMenuItem
                        className="flex items-center gap-2 text-destructive"
                        onClick={() => handleRemoveFeature(feature.id)}
                      >
                        <TrashIcon size={16} />
                        Delete from roadmap
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                </div>
              ))}
            </GanttFeatureListGroup>
          ))}
        </GanttFeatureList>
        <GanttToday />
        <GanttCreateMarkerTrigger onCreateMarker={handleCreateMarker} />
      </GanttTimeline>
    </GanttProvider>
  );
};

const ListView = ({
  features,
  setFeatures,
}: {
  features: Feature[];
  setFeatures: React.Dispatch<React.SetStateAction<Feature[]>>;
}) => {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const status = statusesRef.find((s) => s.name === over.id);

    if (!status) {
      return;
    }

    setFeatures(
      features.map((feature) => {
        if (feature.id === active.id) {
          return { ...feature, status };
        }

        return feature;
      })
    );
  };

  return (
    <ListProvider className="overflow-auto" onDragEnd={handleDragEnd}>
      {statusesRef.map((status) => {
        const statusFeatures = features.filter(
          (feature) => feature.status?.name === status.name
        );

        return (
          <ListGroup id={status.name} key={status.id}>
            <ListHeader color={status.color} name={status.name} />
            <ListItems>
              {statusFeatures.map((feature, index) => (
                <ListItem
                  id={feature.id}
                  index={index}
                  key={feature.id}
                  name={feature.name}
                  parent={status.name}
                >
                  <div
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: feature.status.color }}
                  />
                  <p className="m-0 flex-1 font-medium text-sm">
                    {feature.name}
                  </p>
                  {feature.owner && (
                    <Avatar className="h-4 w-4 shrink-0">
                      <AvatarImage src={feature.owner.avatarUrl} />
                      <AvatarFallback>
                        {feature.owner.name?.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </ListItem>
              ))}
            </ListItems>
          </ListGroup>
        );
      })}
    </ListProvider>
  );
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

const KanbanView = ({
  features: baseFeat,
  setFeatures: setBaseFeat,
}: {
  features: Feature[];
  setFeatures: React.Dispatch<React.SetStateAction<Feature[]>>;
}) => {
  const features = baseFeat.map((feature) => ({
    ...feature,
    column: feature.status.id,
  }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const status = statusesRef.find(({ id }) => id === over.id);

    if (!status) {
      return;
    }

    setBaseFeat(
      baseFeat.map((feature) => {
        if (feature.id === active.id) {
          return { ...feature, status };
        }

        return feature;
      })
    );
  };

  return (
    <KanbanProvider
      className="p-4"
      columns={statusesRef}
      data={features}
      onDragEnd={handleDragEnd}
    >
      {(column) => (
        <KanbanBoard id={column.id} key={column.id}>
          <KanbanHeader>{column.name}</KanbanHeader>
          <KanbanCards id={column.id}>
            {(feature: (typeof features)[number]) => (
              <KanbanCard
                column={column.id}
                id={feature.id}
                key={feature.id}
                name={feature.name}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <p className="m-0 flex-1 font-medium text-sm">
                      {feature.name}
                    </p>
                    <p className="m-0 text-muted-foreground text-xs">
                      {feature.initiative.name}
                    </p>
                  </div>
                  {feature.owner && (
                    <Avatar className="h-4 w-4 shrink-0">
                      <AvatarImage src={feature.owner.avatarUrl} />
                      <AvatarFallback>
                        {feature.owner.name?.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <p className="m-0 text-muted-foreground text-xs">
                  {shortDateFormatter.format(feature.startAt)} -{" "}
                  {dateFormatter.format(feature.endAt)}
                </p>
              </KanbanCard>
            )}
          </KanbanCards>
        </KanbanBoard>
      )}
    </KanbanProvider>
  );
};

const TableView = ({ features }: { features: Feature[] }) => {
  const columns: ColumnDef<Feature>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <TableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="relative">
            <Avatar className="size-6">
              <AvatarImage src={row.original.owner.avatarUrl} />
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
    <div className="size-full overflow-auto">
      <TableProvider columns={columns} data={features}>
        <TableHeader>
          {({ headerGroup }) => (
            <TableHeaderGroup headerGroup={headerGroup} key={headerGroup.id}>
              {({ header }) => <TableHead header={header} key={header.id} />}
            </TableHeaderGroup>
          )}
        </TableHeader>
        <TableBody>
          {({ row }) => (
            <TableRow key={row.id} row={row}>
              {({ cell }) => <TableCell cell={cell} key={cell.id} />}
            </TableRow>
          )}
        </TableBody>
      </TableProvider>
    </div>
  );
};

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
                <AvatarImage src={row.original.owner.avatarUrl} />
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
                  <TableRow row={row} className="hover:bg-muted/50">
                    {({ cell }) => <TableCell cell={cell} key={cell.id} />}
                  </TableRow>
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
        avatarUrl: project.owner.avatar_url || "",
        role: project.owner.role || null,
      }
    : { id: "", name: "", avatarUrl: "", role: null },
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

const Example = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [selectedStreams, setSelectedStreams] = useState<string[]>(
    streamMetadata.map((s) => s.name)
  );
  const [newProject, setNewProject] = useState({
    name: "",
    stream: "",
    startDate: new Date(),
    endDate: new Date(),
    status: "",
    owner: "",
    description: "",
  });
  const [editProject, setEditProject] = useState({
    id: "",
    name: "",
    stream: "",
    startDate: new Date(),
    endDate: new Date(),
    status: "",
    owner: "",
    description: "",
  });
  const [owners, setOwners] = useState<Owner[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const filterOutBacklog = (items: Feature[]) =>
    items.filter((item) => item.status.name !== "Backlog");

  // Fetch projects from Supabase on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const projects = await getAllProjects();
        const transformed = projects.map(transformProject);
        setFeatures(filterOutBacklog(transformed));
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchOwnersList = async () => {
      try {
        const ownerList = await getAllOwners();
        setOwners(ownerList);
      } catch (error) {
        console.error("Error fetching owners:", error);
      }
    };

    fetchProjects();
    fetchOwnersList();
  }, []);

  const handleViewFeature = (id: string) => {
    const feature = features.find((f) => f.id === id);
    if (feature) {
      setSelectedFeature(feature);
      setIsDetailsDialogOpen(true);
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
        owner: feature.owner.name,
        description: feature.description,
      });
      setIsEditDialogOpen(true);
    }
  };

  const toggleStream = (streamName: string) => {
    setSelectedStreams((prev) =>
      prev.includes(streamName)
        ? prev.filter((s) => s !== streamName)
        : [...prev, streamName]
    );
  };

  const filteredFeatures = features.filter((feature) =>
    selectedStreams.includes(feature.product.name)
  );

  const handleCreateProject = async () => {
    if (!newProject.name || !newProject.stream || !newProject.status) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setIsCreating(true);
      // Fetch reference data to get IDs
      const results = await Promise.all([
        getAllStatuses(),
        getAllStreams(),
        getAllOwners(),
        getAllUsers(),
        getAllInitiatives(),
        getAllReleases(),
      ]);

      const statuses = results[0] as Status[];
      const streams = results[1] as Stream[];
      const ownersFromDb = results[2] as Owner[];
      const users = results[3] as User[];
      const initiatives = results[4] as Initiative[];
      const releases = results[5] as Release[];

      const selectedStream = streams.find((s) => s.name === newProject.stream);
      const selectedStatus = statuses.find((s) => s.name === newProject.status);
      const selectedOwner = ownersFromDb.find(
        (owner) => owner.name === newProject.owner
      );
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
        owner_id: selectedOwner?.id || defaultUser?.id || null,
        initiative_id: initiative?.id || null,
        release_id: release?.id || null,
        progress: 0,
      });

      // Add to local state
      const transformed = transformProject(createdProject);
      setFeatures(filterOutBacklog([...features, transformed]));

      // Reset form
      setIsDialogOpen(false);
      setNewProject({
        name: "",
        stream: "",
        startDate: new Date(),
        endDate: new Date(),
        status: "",
        owner: "",
        description: "",
      });
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Failed to create project. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateProject = async () => {
    if (!editProject.name || !editProject.stream || !editProject.status) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setIsUpdating(true);
      // Fetch reference data to get IDs
      const results = await Promise.all([
        getAllStatuses(),
        getAllStreams(),
        getAllOwners(),
        getAllInitiatives(),
        getAllReleases(),
      ]);

      const statuses = results[0] as Status[];
      const streams = results[1] as Stream[];
      const owners = results[2] as Owner[];
      const initiatives = results[3] as Initiative[];
      const releases = results[4] as Release[];

      const selectedStream = streams.find((s) => s.name === editProject.stream);
      const selectedStatus = statuses.find(
        (s) => s.name === editProject.status
      );
      const selectedOwner = owners.find(
        (owner) => owner.name === editProject.owner
      );

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
        owner_id: selectedOwner?.id || null,
        initiative_id: initiative?.id || null,
        release_id: release?.id || null,
      });

      // Update local state
      const transformed = transformProject(updatedProject);

      setFeatures((prev) => {
        if (transformed.status.name === "Backlog") {
          return prev.filter((f) => f.id !== editProject.id);
        }

        return prev.map((f) => (f.id === editProject.id ? transformed : f));
      });

      // Reset form and close dialog
      setIsEditDialogOpen(false);
      setEditProject({
        id: "",
        name: "",
        stream: "",
        startDate: new Date(),
        endDate: new Date(),
        status: "",
        owner: "",
        description: "",
      });
    } catch (error) {
      console.error("Error updating project:", error);
      alert("Failed to update project. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const views = [
    {
      id: "gantt",
      label: "Gantt",
      icon: GanttChartSquareIcon,
      component: GanttView,
    },
    {
      id: "list",
      label: "List",
      icon: ListIcon,
      component: ListView,
    },
    {
      id: "kanban",
      label: "Kanban",
      icon: KanbanSquareIcon,
      component: KanbanView,
    },
    {
      id: "table",
      label: "Table",
      icon: TableIcon,
      component: TableView,
    },
  ];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading roadmap...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarInset>
        <Tabs
          className="not-prose size-full gap-0 divide-y"
          defaultValue="gantt"
        >
          <div className="flex items-center justify-between gap-4 p-4 border-b">
            <div className="flex items-center gap-1">
              <SidebarTrigger />
              <Separator orientation="vertical" className="h-6 bg-muted" />
              <div>
              <p className="font-medium">Roadmap</p>

                <p className="text-xs text-muted-foreground">
                  {filteredFeatures.length} project
                  {filteredFeatures.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4" />
                    Create Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                    <DialogDescription>
                      Add a new project to your roadmap. Fill in all the details
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
                      <Label htmlFor="owner">Owner</Label>
                      <Select
                        value={newProject.owner}
                        onValueChange={(value) =>
                          setNewProject({ ...newProject, owner: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select an owner" />
                        </SelectTrigger>
                        <SelectContent>
                          {owners.length === 0 ? (
                            <SelectItem value="" disabled>
                              No owners available
                            </SelectItem>
                          ) : (
                            owners.map((owner) => (
                              <SelectItem key={owner.id} value={owner.name}>
                                {owner.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="status">Status *</Label>
                      <Select
                        value={newProject.status}
                        onValueChange={(value) =>
                          setNewProject({ ...newProject, status: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusesRef.map((status) => (
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
                      {isCreating ? "Working" : "Create Project"}
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
                    <DialogTitle>Edit Project</DialogTitle>
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
                          {statusesRef.map((status) => (
                            <SelectItem key={status.id} value={status.name}>
                              {status.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-owner">Owner</Label>
                      <Select
                        value={editProject.owner}
                        onValueChange={(value) =>
                          setEditProject({ ...editProject, owner: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select an owner" />
                        </SelectTrigger>
                        <SelectContent>
                          {owners.length === 0 ? (
                            <SelectItem value="" disabled>
                              No owners available
                            </SelectItem>
                          ) : (
                            owners.map((owner) => (
                              <SelectItem key={owner.id} value={owner.name}>
                                {owner.name}
                              </SelectItem>
                            ))
                          )}
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

              <TabsList>
                {views.map((view) => (
                  <TabsTrigger key={view.id} value={view.id}>
                    <view.icon size={16} />
                    <span className="sr-only">{view.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>

          {/* Stream Filters - Horizontal Bar */}
          <div className="flex items-center gap-3 px-4 py-3 border-b bg-muted/30">
            <Label className="text-sm font-medium whitespace-nowrap">
              Filter by Stream:
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="min-w-[200px] justify-between"
                >
                  {selectedStreams.length === streamMetadata.length
                    ? "All Streams"
                    : selectedStreams.length === 0
                    ? "No streams selected"
                    : `${selectedStreams.length} selected`}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search streams..." />
                  <CommandList>
                    <CommandEmpty>No stream found.</CommandEmpty>
                    <CommandGroup>
                      {streamMetadata.map((stream) => {
                        const StreamIcon = stream.icon;
                        const isSelected = selectedStreams.includes(
                          stream.name
                        );
                        const count = features.filter(
                          (f) => f.product.name === stream.name
                        ).length;
                        return (
                          <CommandItem
                            key={stream.name}
                            value={stream.name}
                            onSelect={() => toggleStream(stream.name)}
                          >
                            <div
                              className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary ${
                                isSelected
                                  ? "bg-primary text-primary-foreground"
                                  : "opacity-50 [&_svg]:invisible"
                              }`}
                            >
                              <Check className="h-4 w-4" />
                            </div>
                            <div
                              className="mr-2 p-1 rounded text-white"
                              style={{ backgroundColor: stream.color }}
                            >
                              <StreamIcon className="h-3 w-3" />
                            </div>
                            <span>{stream.name}</span>
                            <span className="ml-auto text-xs text-muted-foreground">
                              ({count})
                            </span>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setSelectedStreams(streamMetadata.map((s) => s.name))
              }
            >
              Select All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedStreams([])}
            >
              Clear All
            </Button>
            {selectedStreams.length > 0 &&
              selectedStreams.length < streamMetadata.length && (
                <div className="flex items-center gap-2 ml-auto">
                  <div className="flex flex-wrap gap-1">
                    {selectedStreams.slice(0, 3).map((streamName) => {
                      const stream = streamMetadata.find(
                        (s) => s.name === streamName
                      );
                      if (!stream) return null;
                      const StreamIcon = stream.icon;
                      return (
                        <div
                          key={streamName}
                          className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border bg-background"
                        >
                          <div
                            className="p-0.5 rounded text-white"
                            style={{ backgroundColor: stream.color }}
                          >
                            <StreamIcon className="h-2.5 w-2.5" />
                          </div>
                          <span>{streamName}</span>
                          <button
                            onClick={() => toggleStream(streamName)}
                            className="ml-1 hover:bg-muted rounded-sm"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      );
                    })}
                    {selectedStreams.length > 3 && (
                      <div className="px-2 py-1 text-xs text-muted-foreground">
                        +{selectedStreams.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              )}
          </div>

          {views.map((view) => (
            <TabsContent
              className="overflow-hidden"
              key={view.id}
              value={view.id}
            >
              {view.id === "gantt" && (
                <GanttView
                  features={filteredFeatures}
                  setFeatures={setFeatures}
                  onViewFeature={handleViewFeature}
                  onEditFeature={handleEditFeature}
                />
              )}
              {view.id === "list" && (
                <ListView
                  features={filteredFeatures}
                  setFeatures={setFeatures}
                />
              )}
              {view.id === "kanban" && (
                <KanbanView
                  features={filteredFeatures}
                  setFeatures={setFeatures}
                />
              )}
              {view.id === "table" && <TableView features={filteredFeatures} />}
            </TabsContent>
          ))}

          {/* Project Details Dialog */}
          <Dialog
            open={isDetailsDialogOpen}
            onOpenChange={setIsDetailsDialogOpen}
          >
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{selectedFeature?.name}</DialogTitle>
                <DialogDescription>
                  Project details and information
                </DialogDescription>
              </DialogHeader>
              {selectedFeature && (
                <div className="grid gap-6 py-4">
                  <div className="grid gap-2">
                    <Label className="text-sm font-semibold">Description</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedFeature.description || "No description provided"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label className="text-sm font-semibold">Stream</Label>
                      <p className="text-sm">{selectedFeature.product.name}</p>
                    </div>

                    <div className="grid gap-2">
                      <Label className="text-sm font-semibold">Status</Label>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{
                            backgroundColor: selectedFeature.status.color,
                          }}
                        />
                        <span className="text-sm">
                          {selectedFeature.status.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label className="text-sm font-semibold">
                        Start Date
                      </Label>
                      <p className="text-sm">
                        {format(selectedFeature.startAt, "PPP")}
                      </p>
                    </div>

                    <div className="grid gap-2">
                      <Label className="text-sm font-semibold">End Date</Label>
                      <p className="text-sm">
                        {format(selectedFeature.endAt, "PPP")}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label className="text-sm font-semibold">
                        Initiative
                      </Label>
                      <p className="text-sm">
                        {selectedFeature.initiative.name}
                      </p>
                    </div>

                    <div className="grid gap-2">
                      <Label className="text-sm font-semibold">Release</Label>
                      <p className="text-sm">{selectedFeature.release.name}</p>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label className="text-sm font-semibold">Owner</Label>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={selectedFeature.owner.avatarUrl} />
                        <AvatarFallback>
                          {selectedFeature.owner.name?.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">
                        {selectedFeature.owner.name}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDetailsDialogOpen(false)}
                >
                  Close
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </Tabs>
      </SidebarInset>
  );
};

export default Example;

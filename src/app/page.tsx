'use client';

import {
  CalendarBody,
  CalendarDate,
  CalendarDatePagination,
  CalendarDatePicker,
  CalendarHeader,
  CalendarItem,
  CalendarMonthPicker,
  CalendarProvider,
  CalendarYearPicker,
} from '@/components/ui/shadcn-io/calendar';
import {
  GanttCreateMarkerTrigger,
  GanttFeatureItem,
  GanttFeatureList,
  GanttFeatureListGroup,
  GanttHeader,
  GanttMarker,
  GanttProvider,
  GanttSidebar,
  GanttSidebarGroup,
  GanttSidebarItem,
  GanttTimeline,
  GanttToday,
} from '@/components/ui/shadcn-io/gantt';
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from '@/components/ui/shadcn-io/kanban';
import {
  type DragEndEvent,
  ListGroup,
  ListHeader,
  ListItem,
  ListItems,
  ListProvider,
} from '@/components/ui/shadcn-io/list';
import type { ColumnDef } from '@/components/ui/shadcn-io/table';
import {
  TableBody,
  TableCell,
  TableColumnHeader,
  TableHead,
  TableHeader,
  TableHeaderGroup,
  TableProvider,
  TableRow,
} from '@/components/ui/shadcn-io/table';
import groupBy from 'lodash.groupby';
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
} from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

// Helper function to generate dates from month offset (current month = 0)
const getDateFromOffset = (monthOffset: number): Date => {
  const today = new Date();
  const baseDate = new Date(today.getFullYear(), today.getMonth(), 1); // First day of current month
  return new Date(baseDate.getFullYear(), baseDate.getMonth() + monthOffset, 1);
};

// Helper to generate unique IDs
let idCounter = 0;
const generateId = () => `id-${++idCounter}`;

// Statuses
const statuses = [
  { id: generateId(), name: 'Not started', color: '#6B7280' },
  { id: generateId(), name: 'In progress', color: '#3B82F6' },
  { id: generateId(), name: 'At risk', color: '#F59E0B' },
  { id: generateId(), name: 'Done', color: '#10B981' },
  { id: generateId(), name: 'Cancelled', color: '#EF4444' },
];

// Mock users for avatar display
const users = [
  { id: generateId(), name: 'Product Team', image: '' },
];

// Stream definitions with their metadata
const streamMetadata = [
  { name: 'Payments', icon: DollarSign, color: '#3B82F6' },
  { name: 'Rewards', icon: TrendingUp, color: '#A855F7' },
  { name: 'Growth', icon: Users, color: '#10B981' },
  { name: 'US', icon: Globe, color: '#EF4444' },
  { name: 'Mobile', icon: Smartphone, color: '#F97316' },
];

// Products (streams)
const products = streamMetadata.map(stream => ({
  id: generateId(),
  name: stream.name,
}));

// Groups (same as streams for this structure)
const groups = streamMetadata.map(stream => ({
  id: generateId(),
  name: stream.name,
}));

// Mock initiatives and releases
const mockInitiatives = [
  { id: generateId(), name: 'Q4 2025 Initiative' },
  { id: generateId(), name: 'Q1 2026 Initiative' },
  { id: generateId(), name: 'Q2 2026 Initiative' },
];

const mockReleases = [
  { id: generateId(), name: 'Q4 2025' },
  { id: generateId(), name: 'Q1 2026' },
  { id: generateId(), name: 'Q2 2026' },
];

// Real roadmap data
const roadmapData = [
  {
    stream: 'Payments',
    initiatives: [
      {
        name: 'FX Pt 2: 4 Popular Currencies',
        description: 'China, Japan, Thailand, Philippines with complicated requirements. Addressing customer requests and covering all popular currencies to increase use of FX.',
        startMonth: 0,
        duration: 4,
        priority: 'In progress',
        progress: 25,
      },
      {
        name: 'Xero Improvements',
        description: 'Implementing quick, high value wins such as allowing scheduling, showing bills that can\'t be paid and improving UX. Consistently one of the most requested items from customers.',
        startMonth: 1,
        duration: 3,
        priority: 'In progress',
        progress: 10,
      },
      {
        name: 'Payout via PayID',
        description: 'Speed up payments on the remittance end by allowing customers to add a PayID for a payee and get the payment to them same day. A quick win that improves the workflow for paying off AMEX cards.',
        startMonth: 2,
        duration: 2,
        priority: 'Not started',
        progress: 0,
      },
      {
        name: 'Confirmation of Payee',
        description: 'Integrate confirmation of payee into the single payment flow to ensure that customers are paying the right account. Reduces the risk of invoice fraud and chargebacks.',
        startMonth: 4,
        duration: 2,
        priority: 'Not started',
        progress: 0,
      },
      {
        name: 'Import Payee',
        description: 'Allow customers to upload a csv of payees through a generic import that accepts inputs from any other platform. Improves time to first payment and removes barriers for large businesses.',
        startMonth: 6,
        duration: 3,
        priority: 'Not started',
        progress: 0,
      },
    ],
  },
  {
    stream: 'Rewards',
    initiatives: [
      {
        name: 'Member Benefits Update',
        description: 'Implementing updates to clearly show users the benefits of the PayRewards Points packages. This will deliver dynamic content to users based on the package they have taken up and display this to articulate clearly all the benefits a user can get taking up either the 1 or 2 PayReward Points options.',
        startMonth: 0,
        duration: 2,
        priority: 'In progress',
        progress: 15,
      },
      {
        name: 'Emirates & Turkish Airlines Integration',
        description: 'Adding two more partners (Emirates and Turkish Airlines) to the PayRewards platform to support a broader offering of partners where users can redeem their points.',
        startMonth: 1,
        duration: 3,
        priority: 'In progress',
        progress: 5,
      },
      {
        name: 'Personalised Content MVP',
        description: 'Introduce rules based logic to display article/blog content to users based on their preferences set in Salesforce. This will show more relevant and up to date content to the users. The initial integration will focus on basic rules such as showing articles relevant to the page they are on (Rewards, Payments, Travel) and serving the most up to date content.',
        startMonth: 2,
        duration: 4,
        priority: 'Not started',
        progress: 0,
      },
      {
        name: 'Rewards as a Service',
        description: 'Complete the design and fully ticket the work. This will allow the BDM team to talk to prospective partners with clear flow of how this service will work and give them a confident indication on how long it will take to go live. Build to commence post signing of contract.',
        startMonth: 4,
        duration: 2,
        priority: 'Not started',
        progress: 0,
      },
      {
        name: 'Social Proof MVP',
        description: 'As users navigate the site, show them a feed of what previous users have used their points for. For example \'Someone in NSW just transferred enough QBR points to fly Business Class to Singapore\'. This will show real world examples of what users are doing with their points and provide a nudge for them to redeem.',
        startMonth: 6,
        duration: 2,
        priority: 'Not started',
        progress: 0,
      },
    ],
  },
  {
    stream: 'Growth',
    initiatives: [
      {
        name: 'Initiatives TBC',
        description: 'Roadmap items to be confirmed for the growth stream',
        startMonth: 2,
        duration: 3,
        priority: 'Not started',
        progress: 0,
      },
    ],
  },
  {
    stream: 'US',
    initiatives: [
      {
        name: 'Initiatives TBC',
        description: 'Roadmap items to be confirmed for the US expansion stream',
        startMonth: 3,
        duration: 4,
        priority: 'Not started',
        progress: 0,
      },
    ],
  },
  {
    stream: 'Mobile',
    initiatives: [
      {
        name: 'Initiatives TBC',
        description: 'Roadmap items to be confirmed for the mobile stream',
        startMonth: 1,
        duration: 3,
        priority: 'Not started',
        progress: 0,
      },
    ],
  },
];

// Transform roadmap data into features format
const exampleFeatures = roadmapData.flatMap((streamData) => {
  const group = groups.find(g => g.name === streamData.stream)!;
  const product = products.find(p => p.name === streamData.stream)!;
  
  return streamData.initiatives.map((initiative) => {
    const status = statuses.find(s => s.name === initiative.priority)!;
    const startAt = getDateFromOffset(initiative.startMonth);
    const endAt = getDateFromOffset(initiative.startMonth + initiative.duration);
    
    // Determine release based on start month
    let release = mockReleases[0];
    if (initiative.startMonth >= 3 && initiative.startMonth < 6) {
      release = mockReleases[1];
    } else if (initiative.startMonth >= 6) {
      release = mockReleases[2];
    }
    
    return {
      id: generateId(),
      name: initiative.name,
      description: initiative.description,
      startAt,
      endAt,
      status,
      owner: users[0],
      group,
      product,
      initiative: mockInitiatives[Math.floor(initiative.startMonth / 3)],
      release,
    };
  });
});

const GanttView = ({ 
  features, 
  setFeatures,
  onViewFeature
}: { 
  features: typeof exampleFeatures; 
  setFeatures: React.Dispatch<React.SetStateAction<typeof exampleFeatures>>;
  onViewFeature: (id: string) => void;
}) => {
  const groupedFeatures = groupBy(features, 'group.name');

  const sortedGroupedFeatures = Object.fromEntries(
    Object.entries(groupedFeatures).sort(([nameA], [nameB]) =>
      nameA.localeCompare(nameB)
    )
  );

  const handleCopyLink = (id: string) => console.log(`Copy link: ${id}`);

  const handleRemoveFeature = (id: string) =>
    setFeatures((prev) => prev.filter((feature) => feature.id !== id));

  const handleRemoveMarker = (id: string) =>
    console.log(`Remove marker: ${id}`);

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
      className="rounded-none"
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
                              <AvatarImage src={feature.owner.image} />
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
                        Remove from roadmap
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

const CalendarView = ({ features }: { features: typeof exampleFeatures }) => {
  const earliestYear =
    features
      .map((feature) => feature.startAt.getFullYear())
      .sort()
      .at(0) ?? new Date().getFullYear();

  const latestYear =
    features
      .map((feature) => feature.endAt.getFullYear())
      .sort()
      .at(-1) ?? new Date().getFullYear();

  return (
    <CalendarProvider>
      <CalendarDate>
        <CalendarDatePicker>
          <CalendarMonthPicker />
          <CalendarYearPicker end={latestYear} start={earliestYear} />
        </CalendarDatePicker>
        <CalendarDatePagination />
      </CalendarDate>
      <CalendarHeader />
      <CalendarBody features={features}>
        {({ feature }) => <CalendarItem feature={feature} key={feature.id} />}
      </CalendarBody>
    </CalendarProvider>
  );
};

const ListView = ({ 
  features, 
  setFeatures 
}: { 
  features: typeof exampleFeatures; 
  setFeatures: React.Dispatch<React.SetStateAction<typeof exampleFeatures>> 
}) => {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const status = statuses.find((s) => s.name === over.id);

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
      {statuses.map((status) => {
        const statusFeatures = features.filter((feature) => feature.status?.name === status.name);
        
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
                      <AvatarImage src={feature.owner.image} />
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

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
});

const KanbanView = ({ 
  features: baseFeat, 
  setFeatures: setBaseFeat 
}: { 
  features: typeof exampleFeatures; 
  setFeatures: React.Dispatch<React.SetStateAction<typeof exampleFeatures>> 
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

    const status = statuses.find(({ id }) => id === over.id);

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
      columns={statuses}
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
                      <AvatarImage src={feature.owner.image} />
                      <AvatarFallback>
                        {feature.owner.name?.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <p className="m-0 text-muted-foreground text-xs">
                  {shortDateFormatter.format(feature.startAt)} -{' '}
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

const TableView = ({ features }: { features: typeof exampleFeatures }) => {
  const columns: ColumnDef<(typeof features)[number]>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
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
      ),
    },
    {
      accessorKey: 'startAt',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="Start At" />
      ),
      cell: ({ row }) =>
        new Intl.DateTimeFormat('en-US', {
          dateStyle: 'medium',
        }).format(row.original.startAt),
    },
    {
      accessorKey: 'endAt',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="End At" />
      ),
      cell: ({ row }) =>
        new Intl.DateTimeFormat('en-US', {
          dateStyle: 'medium',
        }).format(row.original.endAt),
    },
    {
      id: 'release',
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

const Example = () => {
  const [features, setFeatures] = useState(exampleFeatures);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<typeof exampleFeatures[number] | null>(null);
  const [selectedStreams, setSelectedStreams] = useState<string[]>(
    streamMetadata.map(s => s.name)
  );
  const [newProject, setNewProject] = useState({
    name: '',
    stream: '',
    startDate: new Date(),
    endDate: new Date(),
    status: '',
    description: '',
  });

  const handleViewFeature = (id: string) => {
    const feature = features.find(f => f.id === id);
    if (feature) {
      setSelectedFeature(feature);
      setIsDetailsDialogOpen(true);
    }
  };

  const toggleStream = (streamName: string) => {
    setSelectedStreams(prev =>
      prev.includes(streamName)
        ? prev.filter(s => s !== streamName)
        : [...prev, streamName]
    );
  };

  const filteredFeatures = features.filter(feature =>
    selectedStreams.includes(feature.product.name)
  );

  const handleCreateProject = () => {
    if (!newProject.name || !newProject.stream || !newProject.status) {
      alert('Please fill in all required fields');
      return;
    }

    const selectedGroup = groups.find(g => g.name === newProject.stream)!;
    const selectedProduct = products.find(p => p.name === newProject.stream)!;
    const selectedStatus = statuses.find(s => s.name === newProject.status)!;
    
    // Calculate which release based on start date
    const startMonth = Math.floor(
      (newProject.startDate.getTime() - new Date(2025, 9, 1).getTime()) / 
      (1000 * 60 * 60 * 24 * 30)
    );
    
    let release = mockReleases[0];
    if (startMonth >= 3 && startMonth < 6) {
      release = mockReleases[1];
    } else if (startMonth >= 6) {
      release = mockReleases[2];
    }

    const newFeature = {
      id: generateId(),
      name: newProject.name,
      description: newProject.description || `Project: ${newProject.name}`,
      startAt: newProject.startDate,
      endAt: newProject.endDate,
      status: selectedStatus,
      owner: users[0],
      group: selectedGroup,
      product: selectedProduct,
      initiative: mockInitiatives[Math.floor(startMonth / 3)] || mockInitiatives[0],
      release,
    };

    setFeatures([...features, newFeature]);
    setIsDialogOpen(false);
    setNewProject({
      name: '',
      stream: '',
      startDate: new Date(),
      endDate: new Date(),
      status: '',
      description: '',
    });
  };

  const views = [
    {
      id: 'gantt',
      label: 'Gantt',
      icon: GanttChartSquareIcon,
      component: GanttView,
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: CalendarIcon,
      component: CalendarView,
    },
    {
      id: 'list',
      label: 'List',
      icon: ListIcon,
      component: ListView,
    },
    {
      id: 'kanban',
      label: 'Kanban',
      icon: KanbanSquareIcon,
      component: KanbanView,
    },
    {
      id: 'table',
      label: 'Table',
      icon: TableIcon,
      component: TableView,
    },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b p-4">
          <h2 className="text-lg font-semibold">Filters</h2>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Filter by Stream</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {streamMetadata.map((stream) => {
                  const StreamIcon = stream.icon;
                  const count = features.filter(f => f.product.name === stream.name).length;
                  return (
                    <SidebarMenuItem key={stream.name}>
                      <div className="flex items-center gap-3 px-2 py-2">
                        <Checkbox
                          id={`stream-${stream.name}`}
                          checked={selectedStreams.includes(stream.name)}
                          onCheckedChange={() => toggleStream(stream.name)}
                        />
                        <label
                          htmlFor={`stream-${stream.name}`}
                          className="flex items-center gap-2 flex-1 cursor-pointer text-sm font-medium"
                        >
                          <div 
                            className="p-1.5 rounded-md text-white"
                            style={{ backgroundColor: stream.color }}
                          >
                            <StreamIcon className="h-3.5 w-3.5" />
                          </div>
                          <span>{stream.name}</span>
                          <span className="ml-auto text-xs text-muted-foreground">({count})</span>
                        </label>
                      </div>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <Separator />
          <SidebarGroup>
            <SidebarGroupContent className="px-4 py-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full mb-2"
                onClick={() => setSelectedStreams(streamMetadata.map(s => s.name))}
              >
                Select All
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setSelectedStreams([])}
              >
                Clear All
              </Button>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <Tabs className="not-prose size-full gap-0 divide-y" defaultValue="gantt">
          <div className="flex items-center justify-between gap-4 p-4 border-b">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <Separator orientation="vertical" className="h-6" />
              <div>
                <p className="font-medium">pay.com.au - Roadmap</p>
                <p className="text-xs text-muted-foreground">
                  {filteredFeatures.length} project{filteredFeatures.length !== 1 ? 's' : ''}
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
                  Add a new project to your roadmap. Fill in all the details below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Project Name *</Label>
                  <Input
                    id="name"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    placeholder="Enter project name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    placeholder="Enter project description"
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="stream">Stream *</Label>
                  <Select
                    value={newProject.stream}
                    onValueChange={(value) => setNewProject({ ...newProject, stream: value })}
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
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={newProject.status}
                    onValueChange={(value) => setNewProject({ ...newProject, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
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
                      <Button variant="outline" className="justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(newProject.startDate, 'PPP')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newProject.startDate}
                        onSelect={(date) => date && setNewProject({ ...newProject, startDate: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid gap-2">
                  <Label>End Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(newProject.endDate, 'PPP')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newProject.endDate}
                        onSelect={(date) => date && setNewProject({ ...newProject, endDate: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateProject}>Create Project</Button>
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
          {views.map((view) => (
            <TabsContent className="overflow-hidden" key={view.id} value={view.id}>
              {view.id === 'gantt' && <GanttView features={filteredFeatures} setFeatures={setFeatures} onViewFeature={handleViewFeature} />}
              {view.id === 'calendar' && <CalendarView features={filteredFeatures} />}
              {view.id === 'list' && <ListView features={filteredFeatures} setFeatures={setFeatures} />}
              {view.id === 'kanban' && <KanbanView features={filteredFeatures} setFeatures={setFeatures} />}
              {view.id === 'table' && <TableView features={filteredFeatures} />}
            </TabsContent>
          ))}
      
      {/* Project Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
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
                  {selectedFeature.description || 'No description provided'}
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
                      style={{ backgroundColor: selectedFeature.status.color }}
                    />
                    <span className="text-sm">{selectedFeature.status.name}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-sm font-semibold">Start Date</Label>
                  <p className="text-sm">{format(selectedFeature.startAt, 'PPP')}</p>
                </div>
                
                <div className="grid gap-2">
                  <Label className="text-sm font-semibold">End Date</Label>
                  <p className="text-sm">{format(selectedFeature.endAt, 'PPP')}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-sm font-semibold">Initiative</Label>
                  <p className="text-sm">{selectedFeature.initiative.name}</p>
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
                    <AvatarImage src={selectedFeature.owner.image} />
                    <AvatarFallback>
                      {selectedFeature.owner.name?.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{selectedFeature.owner.name}</span>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
        </Tabs>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Example;

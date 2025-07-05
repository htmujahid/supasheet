"use client";

import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  Cpu,
  Database,
  FileText,
  GitBranch,
  HardDrive,
  Server,
  TrendingUp,
  Users2,
  Wifi,
} from "lucide-react";
import {
  Area,
  AreaChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  XAxis,
  YAxis,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";

// System monitoring data
const systemMetrics = [
  { name: "CPU Usage", value: 68, status: "normal", icon: Cpu },
  { name: "Memory", value: 84, status: "warning", icon: HardDrive },
  { name: "Storage", value: 45, status: "normal", icon: Database },
  { name: "Network", value: 92, status: "good", icon: Wifi },
];

// Performance radar data
const performanceData = [
  { subject: "Speed", A: 120, B: 110, fullMark: 150 },
  { subject: "Reliability", A: 98, B: 130, fullMark: 150 },
  { subject: "Security", A: 86, B: 130, fullMark: 150 },
  { subject: "Scalability", A: 99, B: 100, fullMark: 150 },
  { subject: "Efficiency", A: 85, B: 90, fullMark: 150 },
  { subject: "Uptime", A: 65, B: 85, fullMark: 150 },
];

// Project timeline data
const timelineData = [
  { month: "Jan", completed: 12, planned: 15 },
  { month: "Feb", completed: 18, planned: 20 },
  { month: "Mar", completed: 22, planned: 25 },
  { month: "Apr", completed: 28, planned: 30 },
  { month: "May", completed: 35, planned: 35 },
  { month: "Jun", completed: 42, planned: 40 },
];

// Task data
const tasks = [
  {
    id: 1,
    title: "Database Migration",
    status: "completed",
    priority: "high",
    assignee: "John D.",
    dueDate: "2024-01-15",
  },
  {
    id: 2,
    title: "API Documentation",
    status: "in-progress",
    priority: "medium",
    assignee: "Sarah M.",
    dueDate: "2024-01-18",
  },
  {
    id: 3,
    title: "Security Audit",
    status: "pending",
    priority: "high",
    assignee: "Mike R.",
    dueDate: "2024-01-20",
  },
  {
    id: 4,
    title: "UI Redesign",
    status: "in-progress",
    priority: "low",
    assignee: "Emma L.",
    dueDate: "2024-01-22",
  },
  {
    id: 5,
    title: "Performance Testing",
    status: "completed",
    priority: "medium",
    assignee: "Alex K.",
    dueDate: "2024-01-16",
  },
];

// Team activity data
const teamActivity = [
  { name: "Commits", value: 247, change: "+12%" },
  { name: "Pull Requests", value: 34, change: "+8%" },
  { name: "Issues Closed", value: 89, change: "+15%" },
  { name: "Code Reviews", value: 156, change: "+5%" },
];

const chartConfig = {
  completed: {
    label: "Completed",
    color: "hsl(var(--zinc-900))",
  },
  planned: {
    label: "Planned",
    color: "hsl(var(--zinc-400))",
  },
};

export function Dashboard3() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-zinc-600";
      case "normal":
        return "text-zinc-500";
      case "warning":
        return "text-zinc-700";
      default:
        return "text-zinc-500";
    }
  };

  const getProgressColor = (value: number) => {
    if (value > 80) return "bg-zinc-700";
    if (value > 60) return "bg-zinc-500";
    return "bg-zinc-400";
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="secondary" className="bg-zinc-800 text-zinc-100">
            High
          </Badge>
        );
      case "medium":
        return (
          <Badge variant="secondary" className="bg-zinc-600 text-zinc-100">
            Medium
          </Badge>
        );
      case "low":
        return (
          <Badge variant="secondary" className="bg-zinc-400 text-zinc-900">
            Low
          </Badge>
        );
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-zinc-600" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-zinc-500" />;
      case "pending":
        return <AlertTriangle className="h-4 w-4 text-zinc-400" />;
      default:
        return <Clock className="h-4 w-4 text-zinc-400" />;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="space-y-2.5">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-base font-bold">Dashboard 3</h1>
        </div>

        {/* System Metrics Row */}
        <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
          {systemMetrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <Card key={index} className="shadow-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs font-medium text-zinc-700 sm:text-sm">
                    {metric.name}
                  </CardTitle>
                  <IconComponent className="h-3 w-3 text-zinc-500 sm:h-4 sm:w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-zinc-900 sm:text-2xl">
                    {metric.value}%
                  </div>
                  <div className="mt-2">
                    <Progress
                      value={metric.value}
                      className={`h-1.5 bg-zinc-100 sm:h-2 ${getProgressColor(metric.value)}`}
                    />
                  </div>
                  <p
                    className={`mt-1 text-xs ${getStatusColor(metric.status)}`}
                  >
                    {metric.status === "good"
                      ? "Optimal"
                      : metric.status === "warning"
                        ? "Attention needed"
                        : "Normal"}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid gap-2.5 lg:grid-cols-3">
          {/* Project Timeline */}
          <Card className="overflow-hidden shadow-none lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-zinc-900">Project Timeline</CardTitle>
              <CardDescription className="text-zinc-600">
                Completed vs planned tasks over time
              </CardDescription>
            </CardHeader>
            <CardContent className="w-full">
              <ChartContainer
                config={chartConfig}
                className="h-[200px] w-full max-w-full sm:h-[250px] lg:h-[300px]"
              >
                <AreaChart
                  data={timelineData}
                  width={undefined}
                  height={undefined}
                  className="w-full"
                >
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    className="text-zinc-500"
                    fontSize={10}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis hide />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <defs>
                    <linearGradient
                      id="fillCompleted"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--zinc-900))"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--zinc-900))"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient
                      id="fillPlanned"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--zinc-400))"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--zinc-400))"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    dataKey="planned"
                    type="natural"
                    fill="url(#fillPlanned)"
                    fillOpacity={0.4}
                    stroke="hsl(var(--zinc-400))"
                    stackId="a"
                  />
                  <Area
                    dataKey="completed"
                    type="natural"
                    fill="url(#fillCompleted)"
                    fillOpacity={0.4}
                    stroke="hsl(var(--zinc-900))"
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Performance Radar */}
          <Card className="overflow-hidden shadow-none">
            <CardHeader>
              <CardTitle className="text-zinc-900">Performance</CardTitle>
              <CardDescription className="text-zinc-600">
                System performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="w-full">
              <ChartContainer
                config={{
                  A: { label: "Current", color: "hsl(var(--zinc-900))" },
                  B: { label: "Target", color: "hsl(var(--zinc-400))" },
                }}
                className="h-[200px] w-full max-w-full sm:h-[250px] lg:h-[300px]"
              >
                <RadarChart
                  data={performanceData}
                  width={undefined}
                  height={undefined}
                  className="w-full"
                >
                  <PolarGrid className="stroke-zinc-200" />
                  <PolarAngleAxis
                    dataKey="subject"
                    className="text-zinc-600"
                    fontSize={8}
                    tick={{ fontSize: 8 }}
                  />
                  <PolarRadiusAxis hide />
                  <Radar
                    name="Current"
                    dataKey="A"
                    stroke="hsl(var(--zinc-900))"
                    fill="hsl(var(--zinc-900))"
                    fillOpacity={0.1}
                  />
                  <Radar
                    name="Target"
                    dataKey="B"
                    stroke="hsl(var(--zinc-400))"
                    fill="hsl(var(--zinc-400))"
                    fillOpacity={0.1}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </RadarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Team Activity & Tasks Row */}
        <div className="grid gap-2.5 lg:grid-cols-3">
          {/* Team Activity */}
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="text-zinc-900">Team Activity</CardTitle>
              <CardDescription className="text-zinc-600">
                Development metrics this week
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {teamActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-zinc-900">
                      {activity.name}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {activity.change} from last week
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-zinc-900 sm:text-xl">
                      {activity.value}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Task List */}
          <Card className="shadow-none lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-zinc-900">Recent Tasks</CardTitle>
              <CardDescription className="text-zinc-600">
                Current project tasks and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex flex-col justify-between space-y-2 rounded-lg bg-zinc-50 p-3 sm:flex-row sm:items-center sm:space-y-0"
                  >
                    <div className="flex items-start space-x-3">
                      {getStatusIcon(task.status)}
                      <div className="min-w-0 flex-1 space-y-1">
                        <p className="truncate text-sm font-medium text-zinc-900">
                          {task.title}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                          <span className="flex items-center">
                            <Users2 className="mr-1 h-3 w-3" />
                            {task.assignee}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="mr-1 h-3 w-3" />
                            {task.dueDate}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 sm:ml-4">
                      {getPriorityBadge(task.priority)}
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          task.status === "completed"
                            ? "border-zinc-600 text-zinc-600"
                            : task.status === "in-progress"
                              ? "border-zinc-500 text-zinc-500"
                              : "border-zinc-400 text-zinc-400"
                        }`}
                      >
                        {task.status.replace("-", " ")}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-zinc-900">Quick Actions</CardTitle>
            <CardDescription className="text-zinc-600">
              Frequently used system operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-6">
              <Button
                variant="outline"
                className="h-auto flex-col space-y-2 border-zinc-200 bg-transparent p-4 hover:bg-zinc-50"
              >
                <Server className="h-5 w-5 text-zinc-600" />
                <span className="text-xs text-zinc-700">Deploy</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto flex-col space-y-2 border-zinc-200 bg-transparent p-4 hover:bg-zinc-50"
              >
                <Database className="h-5 w-5 text-zinc-600" />
                <span className="text-xs text-zinc-700">Backup</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto flex-col space-y-2 border-zinc-200 bg-transparent p-4 hover:bg-zinc-50"
              >
                <GitBranch className="h-5 w-5 text-zinc-600" />
                <span className="text-xs text-zinc-700">Branch</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto flex-col space-y-2 border-zinc-200 bg-transparent p-4 hover:bg-zinc-50"
              >
                <FileText className="h-5 w-5 text-zinc-600" />
                <span className="text-xs text-zinc-700">Logs</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto flex-col space-y-2 border-zinc-200 bg-transparent p-4 hover:bg-zinc-50"
              >
                <TrendingUp className="h-5 w-5 text-zinc-600" />
                <span className="text-xs text-zinc-700">Analytics</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto flex-col space-y-2 border-zinc-200 bg-transparent p-4 hover:bg-zinc-50"
              >
                <Users2 className="h-5 w-5 text-zinc-600" />
                <span className="text-xs text-zinc-700">Team</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

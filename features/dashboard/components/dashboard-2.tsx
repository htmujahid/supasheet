"use client";

import {
  AlertCircle,
  CheckCircle,
  Globe,
  MessageSquare,
  Target,
  XCircle,
} from "lucide-react";
import { Area, AreaChart, Tooltip } from "recharts";
import {
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";

// Sample data for different charts
const performanceData = [
  { name: "Mobile", value: 45, fill: "#000000" },
  { name: "Desktop", value: 35, fill: "#666666" },
  { name: "Tablet", value: 20, fill: "#cccccc" },
];

const trafficData = [
  { source: "Organic", visitors: 4200 },
  { source: "Direct", visitors: 3100 },
  { source: "Social", visitors: 2400 },
  { source: "Email", visitors: 1800 },
  { source: "Paid", visitors: 1200 },
];

const conversionData = [
  { day: "Mon", rate: 2.4 },
  { day: "Tue", rate: 3.1 },
  { day: "Wed", rate: 2.8 },
  { day: "Thu", rate: 3.5 },
  { day: "Fri", rate: 4.2 },
  { day: "Sat", rate: 3.8 },
  { day: "Sun", rate: 2.9 },
];

const activities = [
  {
    id: 1,
    user: "Sarah Johnson",
    action: "completed a purchase",
    time: "2 minutes ago",
    avatar: "/placeholder.svg?height=32&width=32",
    type: "success",
  },
  {
    id: 2,
    user: "Mike Chen",
    action: "left a 5-star review",
    time: "5 minutes ago",
    avatar: "/placeholder.svg?height=32&width=32",
    type: "success",
  },
  {
    id: 3,
    user: "Emma Davis",
    action: "abandoned cart",
    time: "12 minutes ago",
    avatar: "/placeholder.svg?height=32&width=32",
    type: "warning",
  },
  {
    id: 4,
    user: "Alex Rodriguez",
    action: "signed up for newsletter",
    time: "18 minutes ago",
    avatar: "/placeholder.svg?height=32&width=32",
    type: "info",
  },
  {
    id: 5,
    user: "Lisa Wang",
    action: "reported an issue",
    time: "25 minutes ago",
    avatar: "/placeholder.svg?height=32&width=32",
    type: "error",
  },
];

const goals = [
  { name: "Monthly Revenue", current: 85000, target: 100000, percentage: 85 },
  { name: "New Customers", current: 340, target: 400, percentage: 85 },
  { name: "Product Sales", current: 1250, target: 1500, percentage: 83 },
  {
    name: "Support Tickets",
    current: 45,
    target: 30,
    percentage: 150,
    isReverse: true,
  },
];

const data = [
  {
    revenue: 10400,
    subscription: 40,
  },
  {
    revenue: 14405,
    subscription: 90,
  },
  {
    revenue: 9400,
    subscription: 200,
  },
  {
    revenue: 8200,
    subscription: 278,
  },
  {
    revenue: 7000,
    subscription: 89,
  },
  {
    revenue: 9600,
    subscription: 239,
  },
  {
    revenue: 11244,
    subscription: 78,
  },
  {
    revenue: 26475,
    subscription: 89,
  },
];

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--primary)",
  },
  subscription: {
    label: "Subscriptions",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function Dashboard2() {
  return (
    <div className="min-h-screen">
      <div className="space-y-2.5">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-base font-bold">Dashboard 2</h1>
        </div>

        {/* Top Row - KPI Cards */}
        <div className="grid gap-2.5 grid-cols-1 lg:grid-cols-2 xl:grid-cols-4">
          <Card className="shadow-none pb-0">
            <CardHeader className="flex-shrink-0">
              <CardDescription>Total Revenue</CardDescription>
              <CardTitle className="text-2xl sm:text-3xl">$15,231.89</CardTitle>
              <CardDescription>+20.1% from last month</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0 pt-0">
              <ChartContainer config={chartConfig} className="h-[80px] w-full">
                <LineChart
                  data={data}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 10,
                    bottom: 0,
                  }}
                >
                  <Line
                    type="monotone"
                    strokeWidth={2}
                    dataKey="revenue"
                    stroke="var(--color-revenue)"
                    activeDot={{
                      r: 6,
                    }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
          
          <Card className="shadow-none pb-0">
            <CardHeader className="flex-shrink-0">
              <CardDescription>Subscriptions</CardDescription>
              <CardTitle className="text-2xl sm:text-3xl">+2,350</CardTitle>
              <CardDescription>+180.1% from last month</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0 pt-0">
              <ChartContainer config={chartConfig} className="h-[80px] w-full">
                <AreaChart
                  data={data}
                  margin={{
                    left: 0,
                    right: 0,
                  }}
                >
                  <Area
                    dataKey="subscription"
                    fill="var(--color-subscription)"
                    fillOpacity={0.05}
                    stroke="var(--color-subscription)"
                    strokeWidth={2}
                    type="monotone"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
          
          <Card className="shadow-none pb-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 flex-shrink-0">
              <CardTitle className="text-sm font-medium text-zinc-900">
                Conversion Rate
              </CardTitle>
              <Target className="h-4 w-4 text-zinc-700" />
            </CardHeader>
            <CardContent className="flex-1 pb-0 pt-0">
              <div className="text-2xl font-bold text-zinc-700">3.24%</div>
              <p className="text-xs text-zinc-500">+0.5% from last week</p>
              <ChartContainer config={chartConfig} className="h-[80px] w-full mt-2">
                <BarChart
                  data={conversionData}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 10,
                    bottom: 0,
                  }}
                >
                  <Bar
                    dataKey="rate"
                    fill="hsl(var(--zinc-700))"
                    radius={2}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="shadow-none pb-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 flex-shrink-0">
              <CardTitle className="text-sm font-medium text-zinc-900">
                Bounce Rate
              </CardTitle>
              <Globe className="h-4 w-4 text-zinc-600" />
            </CardHeader>
            <CardContent className="flex-1 pb-0 pt-0">
              <div className="text-2xl font-bold text-zinc-600">42.3%</div>
              <p className="text-xs text-zinc-500">-2.1% from last week</p>
              <ChartContainer config={chartConfig} className="h-[80px] w-full mt-2">
                <AreaChart
                  data={data}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 10,
                    bottom: 0,
                  }}
                >
                  <Area
                    dataKey="revenue"
                    fill="hsl(var(--zinc-600))"
                    fillOpacity={0.1}
                    stroke="hsl(var(--zinc-600))"
                    strokeWidth={1}
                    type="monotone"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Second Row - Charts */}
        <div className="grid gap-2.5 grid-cols-1 lg:grid-cols-3">
          {/* Traffic Sources Bar Chart */}
          <Card className="shadow-none lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-zinc-900">Traffic Sources</CardTitle>
              <CardDescription className="text-zinc-600">
                Visitor distribution by traffic source
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] sm:h-[300px] lg:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trafficData}>
                    <XAxis
                      dataKey="source"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12 }}
                      interval={0}
                    />
                    <YAxis hide tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar
                      dataKey="visitors"
                      fill="hsl(var(--zinc-900))"
                      radius={4}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Device Distribution Pie Chart */}
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="text-zinc-900">Device Usage</CardTitle>
              <CardDescription className="text-zinc-600">
                Traffic by device type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] sm:h-[300px] lg:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={performanceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {performanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-4">
                {performanceData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="text-sm text-zinc-500">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Third Row - Goals and Activity */}
        <div className="grid gap-2.5 grid-cols-1 lg:grid-cols-2">
          {/* Goals Progress */}
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="text-zinc-900">Goals Progress</CardTitle>
              <CardDescription className="text-zinc-600">
                Track your monthly objectives
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {goals.map((goal, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-zinc-900">
                      {goal.name}
                    </span>
                    <span className="text-zinc-500">
                      {goal.current.toLocaleString()} /{" "}
                      {goal.target.toLocaleString()}
                    </span>
                  </div>
                  <Progress
                    value={goal.percentage}
                    className={`h-2 bg-zinc-100 ${goal.isReverse && goal.percentage > 100 ? "bg-red-100" : ""}`}
                  />
                  <div className="flex justify-between text-xs text-zinc-500">
                    <span>
                      {goal.percentage}%{" "}
                      {goal.isReverse ? "over target" : "complete"}
                    </span>
                    {goal.isReverse && goal.percentage > 100 && (
                      <Badge variant="destructive" className="text-xs">
                        Over Target
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="text-zinc-900">Recent Activity</CardTitle>
              <CardDescription className="text-zinc-600">
                Latest user interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={activity.avatar || "/placeholder.svg"}
                      />
                      <AvatarFallback>
                        {activity.user
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-zinc-900">
                          {activity.user}
                        </p>
                        {activity.type === "success" && (
                          <CheckCircle className="h-3 w-3 text-zinc-600" />
                        )}
                        {activity.type === "warning" && (
                          <AlertCircle className="h-3 w-3 text-zinc-500" />
                        )}
                        {activity.type === "error" && (
                          <XCircle className="h-3 w-3 text-zinc-700" />
                        )}
                        {activity.type === "info" && (
                          <MessageSquare className="h-3 w-3 text-zinc-400" />
                        )}
                      </div>
                      <p className="text-sm text-zinc-600">{activity.action}</p>
                      <p className="text-xs text-zinc-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row - Conversion Trend */}
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-zinc-900">
              Weekly Conversion Trend
            </CardTitle>
            <CardDescription className="text-zinc-600">
              Daily conversion rates for the past week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] sm:h-[250px] lg:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={conversionData}>
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis hide tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="hsl(var(--zinc-600))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--zinc-600))", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

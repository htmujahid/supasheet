"use client";

import {
  Activity,
  DollarSign,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { Area, AreaChart, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";

import { Badge } from "@/components/ui/badge";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Sample data for the chart
const chartData = [
  { month: "Jan", revenue: 4000, users: 240 },
  { month: "Feb", revenue: 3000, users: 139 },
  { month: "Mar", revenue: 2000, users: 980 },
  { month: "Apr", revenue: 2780, users: 390 },
  { month: "May", revenue: 1890, users: 480 },
  { month: "Jun", revenue: 2390, users: 380 },
  { month: "Jul", revenue: 3490, users: 430 },
];

// Sample data for pie chart
const pieData = [
  { name: "Desktop", value: 45, color: "#000000" },
  { name: "Mobile", value: 35, color: "#666666" },
  { name: "Tablet", value: 20, color: "#cccccc" },
];

// Sample data for the table
const tableData = [
  {
    id: "001",
    customer: "John Doe",
    email: "john@example.com",
    amount: "$299.00",
    status: "Completed",
    date: "2024-01-15",
  },
  {
    id: "002",
    customer: "Jane Smith",
    email: "jane@example.com",
    amount: "$199.00",
    status: "Pending",
    date: "2024-01-14",
  },
  {
    id: "003",
    customer: "Bob Johnson",
    email: "bob@example.com",
    amount: "$399.00",
    status: "Completed",
    date: "2024-01-13",
  },
  {
    id: "004",
    customer: "Alice Brown",
    email: "alice@example.com",
    amount: "$149.00",
    status: "Failed",
    date: "2024-01-12",
  },
  {
    id: "005",
    customer: "Charlie Wilson",
    email: "charlie@example.com",
    amount: "$249.00",
    status: "Completed",
    date: "2024-01-11",
  },
  {
    id: "006",
    customer: "Diana Davis",
    email: "diana@example.com",
    amount: "$179.00",
    status: "Pending",
    date: "2024-01-10",
  },
];

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  users: {
    label: "Users",
    color: "hsl(var(--chart-2))",
  },
};

export function Dashboard1() {
  return (
    <div className="min-h-screen px-4">
      <div className="space-y-2.5">
        {/* Stats Cards */}
        <div className="grid gap-2.5 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-muted-foreground text-xs">
                <span className="inline-flex items-center text-green-600">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +20.1%
                </span>{" "}
                from last month
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Users
              </CardTitle>
              <Users className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,350</div>
              <p className="text-muted-foreground text-xs">
                <span className="inline-flex items-center text-green-600">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +180.1%
                </span>{" "}
                from last month
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sales</CardTitle>
              <ShoppingCart className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,234</div>
              <p className="text-muted-foreground text-xs">
                <span className="inline-flex items-center text-red-600">
                  <TrendingDown className="mr-1 h-3 w-3" />
                  -19%
                </span>{" "}
                from last month
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Now</CardTitle>
              <Activity className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">573</div>
              <p className="text-muted-foreground text-xs">
                <span className="inline-flex items-center text-green-600">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +201
                </span>{" "}
                since last hour
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>Revenue & Users Overview</CardTitle>
              <CardDescription>Monthly revenue and user growth</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-[2/1] max-h-[300px] min-h-[200px] w-full">
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <AreaChart
                    accessibilityLayer
                    data={chartData}
                    margin={{
                      left: 12,
                      right: 12,
                      top: 8,
                      bottom: 8,
                    }}
                    width={undefined}
                    height={undefined}
                  >
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      fontSize={12}
                    />
                    <YAxis hide />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent />}
                    />
                    <defs>
                      <linearGradient
                        id="fillRevenue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="var(--color-revenue)"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--color-revenue)"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <linearGradient
                        id="fillUsers"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="var(--color-users)"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--color-users)"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <Area
                      dataKey="users"
                      type="natural"
                      fill="url(#fillUsers)"
                      fillOpacity={0.4}
                      stroke="var(--color-users)"
                      stackId="a"
                    />
                    <Area
                      dataKey="revenue"
                      type="natural"
                      fill="url(#fillRevenue)"
                      fillOpacity={0.4}
                      stroke="var(--color-revenue)"
                      stackId="a"
                    />
                  </AreaChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>Device Distribution</CardTitle>
              <CardDescription>Traffic by device type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-[2/1] max-h-[300px] min-h-[200px] w-full">
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table Section */}
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              A list of your recent transactions and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      #{transaction.id}
                    </TableCell>
                    <TableCell>{transaction.customer}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {transaction.email}
                    </TableCell>
                    <TableCell className="font-medium">
                      {transaction.amount}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          transaction.status === "Completed"
                            ? "default"
                            : transaction.status === "Pending"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {transaction.date}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

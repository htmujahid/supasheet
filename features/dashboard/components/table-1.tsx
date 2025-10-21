"use client";

import { useState } from "react";

import { Search } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DashboardWidgetsSchema } from "../lib/types";

export function Table1Widget({
  widget,
  data,
}: {
  widget: DashboardWidgetsSchema;
  data: any[] | null;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  if (!data || data.length === 0) {
    return (
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>{widget.name}</CardTitle>
          <CardDescription>{widget.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No data available</p>
        </CardContent>
      </Card>
    );
  }

  // Get column headers from first data item
  const columns = Object.keys(data[0]);

  // Filter data based on search term
  const filteredData = data.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  );

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <CardTitle>{widget.name}</CardTitle>
            <CardDescription>{widget.description}</CardDescription>
          </div>
          <div className="relative w-full sm:max-w-xs">
            <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column} className="font-medium">
                    {column.charAt(0).toUpperCase() +
                      column.slice(1).replace(/_/g, " ")}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.slice(0, 10).map((row, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column}>{row[column] || "-"}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {widget.caption && (
          <p className="text-muted-foreground mt-2 text-xs">{widget.caption}</p>
        )}
      </CardContent>
    </Card>
  );
}

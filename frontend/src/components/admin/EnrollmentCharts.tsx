"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { ICourse } from "@/types/course";
import type { Enrollment } from "@/pages/admin/Enrollments";

// Define the types for the component props
interface EnrollmentChartProps {
  courses: ICourse[];
  enrollments: Enrollment[];
}

// EnrollmentChart Component
const EnrollmentChart: React.FC<EnrollmentChartProps> = ({
  courses,
  enrollments,
}) => {
  // Process the data to map course titles with enrollment counts
  const chartData = courses?.map((course) => {
    const totalEnrollments = enrollments?.filter(
      (enrollment) => enrollment.courseId === course._id
    ).length;

    return {
      name: course.title, // Course Name
      total: totalEnrollments || 0, // Handle cases where no enrollments exist
    };
  });

  console.log("Processed Chart Data:", chartData);

  return (
    <Card>
      {/* Chart Header */}
      <CardHeader className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <div className="text-center sm:text-left">
          <CardTitle>Course Enrollments</CardTitle>
          <p className="text-sm text-muted-foreground">
            Total enrollments by course
          </p>
        </div>
      </CardHeader>

      {/* Chart Content */}
      <CardContent className="px-2 sm:p-6">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="total"
              fill="hsl(var(--chart-1, #4F46E5))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default EnrollmentChart;

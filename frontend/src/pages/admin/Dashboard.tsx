"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Calendar, BookOpen, Map } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import StatsCard from "../../components/admin/StatsCard";
import RecentDonations from "@/components/admin/RecentDonation";
import UpcomingEvents from "@/components/admin/UpcomingEvents";
import EnrollmentChart from "@/components/admin/EnrollmentCharts";
import { useUsers, useEvents } from "../../lib/api";
import { getBookings } from "@/lib/bookings";
import { getEnrollments } from "@/lib/enrollment";
import { getDonations } from "@/lib/donations";
import { getCourses } from "@/lib/courseApi"; // Updated to use getCourses directly
import { calculateChange } from "../../utils/calculateChange";
import { IBookingData } from "../../types/bookings";
import { Enrollment } from "@/pages/admin/Enrollments";
import { IDonationData } from "../../types/donation";
import { Event } from "../../types/event";
import { ICourse } from "@/types/course"; // Import ICourse type only
import Loader from "@/components/Loader";

const Dashboard = () => {
  const { users, isLoading: usersLoading } = useUsers();
  const { events, isLoading: eventsLoading } = useEvents();
  const [bookings, setBookings] = useState<IBookingData[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [donations, setDonations] = useState<IDonationData[]>([]);
  const [courses, setCourses] = useState<ICourse[]>([]); // Store courses directly
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsData, enrollmentsData, donationsData, coursesData] =
          await Promise.all([
            getBookings(),
            getEnrollments(),
            getDonations(),
            getCourses(), // Now directly fetching courses
          ]);

        setBookings(bookingsData.bookingForms);
        setEnrollments(enrollmentsData.enrollments);
        setDonations(donationsData);
        setCourses(coursesData); // Directly set courses without extraction
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateMonthlyData = (data: any[], dateField = "createdAt") => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;

    const currentMonthData = data.filter(
      (item) => new Date(item[dateField]).getMonth() === currentMonth
    );
    const previousMonthData = data.filter(
      (item) => new Date(item[dateField]).getMonth() === previousMonth
    );

    return {
      current: currentMonthData.length,
      previous: previousMonthData.length,
      change: calculateChange(
        currentMonthData.length,
        previousMonthData.length
      ),
    };
  };

  const calculateEventStatus = (event: Event) => {
    const now = new Date();
    const eventDate = new Date(event.date);
    if (eventDate > now) {
      return "Upcoming";
    } else if (eventDate.toDateString() === now.toDateString()) {
      return "Active";
    } else {
      return "Past";
    }
  };

  const activeEvents = events?.filter(
    (event) => calculateEventStatus(event) === "Active"
  );

  const stats = [
    {
      title: "Total Students",
      value: users?.length.toString() || "0",
      change: calculateChange(users?.length || 0, (users?.length || 0) - 10),
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Total Courses",
      value: courses?.length.toString() || "0",
      change: calculateChange(courses?.length || 0, (courses?.length || 0) - 5),
      icon: BookOpen,
      color: "bg-yellow-500",
    },
    {
      title: "Active Events",
      value: activeEvents?.length.toString() || "0",
      change: calculateChange(
        activeEvents?.length || 0,
        (activeEvents?.length || 0) - 2
      ),
      icon: Calendar,
      color: "bg-red-500",
    },
    {
      title: "Course Enrollments",
      value: enrollments.length.toString() || "0",
      ...calculateMonthlyData(enrollments),
      icon: BookOpen,
      color: "bg-green-500",
    },
    {
      title: "Tour Bookings",
      value: bookings.length.toString() || "0",
      ...calculateMonthlyData(bookings),
      icon: Map,
      color: "bg-purple-500",
    },
  ];
  console.log("Enrollments", enrollments);
  if (isLoading || usersLoading || eventsLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <motion.h1
          className="text-2xl font-bold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Dashboard
        </motion.h1>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <RecentDonations donations={donations} />
          <UpcomingEvents events={events || []} />
        </div>

        <EnrollmentChart courses={courses || []} enrollments={enrollments} />
      </div>
    </AdminLayout>
  );
};

export default Dashboard;

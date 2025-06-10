"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Users, FolderOpen, Award, MessageSquare, Plus, Image } from "lucide-react";
import Link from "next/link";
import { ImageUpload } from "@/components/admin/image-upload";
import { toast } from "react-hot-toast";

interface Stats {
  profileCount: number;
  experienceCount: number;
  projectCount: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    profileCount: 0,
    experienceCount: 0,
    projectCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [homePageImage, setHomePageImage] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [profilesRes, experiencesRes, projectsRes] = await Promise.all([
        fetch('/api/profiles'),
        fetch('/api/experiences'),
        fetch('/api/projects'),
      ]);

      const [profiles, experiences, projects] = await Promise.all([
        profilesRes.json(),
        experiencesRes.json(),
        projectsRes.json(),
      ]);

      setStats({
        profileCount: Array.isArray(profiles) ? profiles.length : 0,
        experienceCount: Array.isArray(experiences) ? experiences.length : 0,
        projectCount: Array.isArray(projects) ? projects.length : 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Profiles",
      value: stats.profileCount,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Experiences",
      value: stats.experienceCount,
      icon: Award,
      color: "text-green-600",
    },
    {
      title: "Projects", 
      value: stats.projectCount,
      icon: FolderOpen,
      color: "text-purple-600",
    },
    {
      title: "Total Content",
      value: stats.experienceCount + stats.projectCount,
      icon: BarChart,
      color: "text-orange-600",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Portfolio Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your portfolio content, experiences, and projects.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <IconComponent className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Link href="/admin/experiences">
                <Button className="w-full" variant="default">
                  <Award className="h-4 w-4 mr-2" />
                  Manage Experiences
                </Button>
              </Link>
              <Link href="/admin/projects">
                <Button className="w-full" variant="secondary">
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Manage Projects
                </Button>
              </Link>
              <Link href="/admin/profiles">
                <Button className="w-full" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  User Profiles
                </Button>
              </Link>
              <Link href="/admin/settings">
                <Button className="w-full" variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No recent activity to display. Start by adding some content!
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ImageUpload
          title="Home Page Hero Image"
          description="Upload or set a hero image for the home page"
          endpoint="homePageImage"
          value={homePageImage}
          onChange={(url) => setHomePageImage(url || "")}
        />

        <Card>
          <CardHeader>
            <CardTitle>Content Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Experiences</span>
              <Link href="/admin/experiences">
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Projects</span>
              <Link href="/admin/projects">
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Images</span>
              <Button size="sm" variant="outline">
                <Image className="h-4 w-4 mr-2" />
                Browse All
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
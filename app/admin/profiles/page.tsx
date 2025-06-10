"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

interface Member {
  id: string;
  type: string;
  provider: string;
  providerAccountId: string;
  createdAt: string;
  updatedAt: string;
}

interface Profile {
  id: string;
  userId: string;
  name: string | null;
  email: string | null;
  imageUrl: string | null;
  members: Member[];
  createdAt: string;
  updatedAt: string;
}

export default function ProfilesPage() {
  const { user } = useUser();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingMember, setUpdatingMember] = useState<string | null>(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const response = await fetch("/api/profiles");
      if (!response.ok) throw new Error("Failed to fetch profiles");
      const data = await response.json();
      setProfiles(data);
    } catch (error) {
      console.error("Error fetching profiles:", error);
      toast.error("Failed to load profiles");
    } finally {
      setLoading(false);
    }
  };

  const updateMemberRole = async (memberId: string, newRole: string) => {
    setUpdatingMember(memberId);
    try {
      const response = await fetch(`/api/members/${memberId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: newRole }),
      });

      if (!response.ok) throw new Error("Failed to update member role");
      
      toast.success("Member role updated successfully");
      fetchProfiles(); // Refresh the data
    } catch (error) {
      console.error("Error updating member role:", error);
      toast.error("Failed to update member role");
    } finally {
      setUpdatingMember(null);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "destructive";
      case "MODERATOR":
        return "secondary";
      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">User Profiles</h2>
        <p className="text-muted-foreground">
          Manage user profiles and roles. You are currently the only admin.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Profiles ({profiles.length})</CardTitle>
          <CardDescription>
            View and manage user profiles and their roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={profile.imageUrl || undefined} />
                        <AvatarFallback>
                          {profile.name?.charAt(0) || profile.email?.charAt(0) || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{profile.name || "Unknown"}</p>
                        <p className="text-sm text-muted-foreground">ID: {profile.userId}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{profile.email || "No email"}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {profile.members.map((member) => (
                        <div key={member.id} className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {member.provider}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {profile.members.map((member) => (
                      <div key={member.id} className="flex items-center gap-2">
                        <Badge variant={getRoleBadgeColor(member.type)}>
                          {member.type}
                        </Badge>
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {profile.members.map((member) => (
                      <Select
                        key={member.id}
                        value={member.type}
                        onValueChange={(value) => updateMemberRole(member.id, value)}
                        disabled={updatingMember === member.id || profile.userId === user?.id}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                          <SelectItem value="MODERATOR">Moderator</SelectItem>
                          <SelectItem value="GUEST">Guest</SelectItem>
                        </SelectContent>
                      </Select>
                    ))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profile Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <p className="text-2xl font-bold">{profiles.length}</p>
              <p className="text-muted-foreground">Total Profiles</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {profiles.filter(p => p.members.some(m => m.type === "ADMIN")).length}
              </p>
              <p className="text-muted-foreground">Admins</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {profiles.filter(p => p.members.some(m => m.type === "GUEST")).length}
              </p>
              <p className="text-muted-foreground">Guests</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
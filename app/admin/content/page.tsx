"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus, Save, FileText, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";

interface Content {
  id: string;
  key: string;
  type: string;
  title: string;
  content: string;
  isPublished: boolean;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

const contentTypes = [
  { value: "HERO_TITLE", label: "Hero Title" },
  { value: "HERO_SUBTITLE", label: "Hero Subtitle" },
  { value: "HERO_DESCRIPTION", label: "Hero Description" },
  { value: "ABOUT_TITLE", label: "About Title" },
  { value: "ABOUT_CONTENT", label: "About Content" },
  { value: "PROJECTS_TITLE", label: "Projects Title" },
  { value: "PROJECTS_DESCRIPTION", label: "Projects Description" },
  { value: "SKILLS_TITLE", label: "Skills Title" },
  { value: "SKILLS_DESCRIPTION", label: "Skills Description" },
  { value: "EXPERIENCE_TITLE", label: "Experience Title" },
  { value: "EXPERIENCE_DESCRIPTION", label: "Experience Description" },
  { value: "CONTACT_TITLE", label: "Contact Title" },
  { value: "CONTACT_DESCRIPTION", label: "Contact Description" },
  { value: "CONTACT_EMAIL", label: "Contact Email" },
  { value: "FOOTER_TEXT", label: "Footer Text" },
  { value: "NAVIGATION_CTA", label: "Navigation CTA" },
  { value: "MICROPHONE_TITLE", label: "Microphone Title" },
  { value: "MICROPHONE_DESCRIPTION", label: "Microphone Description" },
  { value: "CUSTOM", label: "Custom" }
];

export default function ContentManagement() {
  const { isLoaded, userId } = useAuth();
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0
  });

  const [formData, setFormData] = useState({
    key: "",
    type: "HERO_TITLE",
    title: "",
    content: "",
    isPublished: true
  });

  useEffect(() => {
    if (isLoaded && userId) {
      fetchContents();
    }
  }, [isLoaded, userId]);

  const fetchContents = async () => {
    try {
      const response = await fetch("/api/content");
      if (response.ok) {
        const data = await response.json();
        setContents(data);
        setStats({
          total: data.length,
          published: data.filter((c: Content) => c.isPublished).length,
          draft: data.filter((c: Content) => !c.isPublished).length
        });
      }
    } catch (error) {
      console.error("Error fetching contents:", error);
      toast.error("Failed to fetch contents");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingContent 
        ? `/api/content/${editingContent.id}` 
        : "/api/content";
      const method = editingContent ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success(editingContent ? "Content updated!" : "Content created!");
        fetchContents();
        resetForm();
        setIsDialogOpen(false);
      } else {
        throw new Error("Failed to save content");
      }
    } catch (error) {
      console.error("Error saving content:", error);
      toast.error("Failed to save content");
    }
  };

  const handleEdit = (content: Content) => {
    setEditingContent(content);
    setFormData({
      key: content.key,
      type: content.type,
      title: content.title,
      content: content.content,
      isPublished: content.isPublished
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this content?")) return;

    try {
      const response = await fetch(`/api/content/${id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        toast.success("Content deleted!");
        fetchContents();
      } else {
        throw new Error("Failed to delete content");
      }
    } catch (error) {
      console.error("Error deleting content:", error);
      toast.error("Failed to delete content");
    }
  };

  const resetForm = () => {
    setFormData({
      key: "",
      type: "HERO_TITLE",
      title: "",
      content: "",
      isPublished: true
    });
    setEditingContent(null);
  };

  const seedInitialContent = async () => {
    try {
      const response = await fetch("/api/content/seed", {
        method: "POST"
      });

      if (response.ok) {
        toast.success("Initial content seeded successfully!");
        fetchContents();
      } else {
        throw new Error("Failed to seed content");
      }
    } catch (error) {
      console.error("Error seeding content:", error);
      toast.error("Failed to seed content");
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Content Management</h2>
          <p className="text-muted-foreground">
            Manage your website content, bio, and marketing copy
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={seedInitialContent} variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Seed Initial Content
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Content
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingContent ? "Edit Content" : "Create New Content"}
                </DialogTitle>
                <DialogDescription>
                  {editingContent ? "Update the content details below." : "Add new content to your website."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="key">Content Key</Label>
                    <Input
                      id="key"
                      value={formData.key}
                      onChange={(e) => setFormData({...formData, key: e.target.value})}
                      placeholder="unique-content-key"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Content Type</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {contentTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Content title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    placeholder="Write your content here..."
                    className="min-h-[300px]"
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="published"
                    checked={formData.isPublished}
                    onCheckedChange={(checked) => setFormData({...formData, isPublished: checked})}
                  />
                  <Label htmlFor="published">Published</Label>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    {editingContent ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Content</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Eye className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.published}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <EyeOff className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.draft}</div>
          </CardContent>
        </Card>
      </div>

      {/* Content Cards */}
      <div className="grid gap-6">
        {contents.map((content) => (
          <Card key={content.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {content.title}
                    <Badge variant={content.isPublished ? "default" : "secondary"}>
                      {content.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Key: {content.key} • Type: {content.type}
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(content)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(content.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {content.content.substring(0, 200)}...
                </p>
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                Updated: {new Date(content.updatedAt).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {contents.length === 0 && !loading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No content yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Get started by creating your first piece of content.
            </p>
            <Button onClick={seedInitialContent}>
              Seed Initial Content
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 
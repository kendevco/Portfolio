"use client";

import { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Edit, Save, X } from "lucide-react";
import { toast } from "sonner";

interface ContentBlockProps {
  contentKey: string;
  defaultContent?: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  editable?: boolean;
  placeholder?: string;
}

interface Content {
  id: string;
  key: string;
  type: string;
  title: string;
  content: string;
  isPublished: boolean;
}

export default function ContentBlock({ 
  contentKey, 
  defaultContent = "", 
  className = "",
  as: Component = "div",
  editable = true,
  placeholder = "Click to edit content..."
}: ContentBlockProps) {
  const { userId } = useAuth();
  const { user } = useUser();
  const [content, setContent] = useState<Content | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!userId) return;
      
      try {
        const response = await fetch("/api/user/admin-status");
        if (response.ok) {
          const data = await response.json();
          setIsAdmin(data.isAdmin);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    };

    checkAdminStatus();
  }, [userId]);

  // Fetch content from API
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`/api/content?key=${contentKey}`);
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setContent(data);
            setEditValue(data.content);
          } else {
            // Content doesn't exist, use default
            setEditValue(defaultContent);
          }
        }
      } catch (error) {
        console.error("Error fetching content:", error);
        setEditValue(defaultContent);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [contentKey, defaultContent]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const contentData = {
        key: contentKey,
        type: "CUSTOM",
        title: `Content for ${contentKey}`,
        content: editValue,
        isPublished: true
      };

      const url = content ? `/api/content/${content.id}` : "/api/content";
      const method = content ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contentData)
      });

      if (response.ok) {
        const updatedContent = await response.json();
        setContent(updatedContent);
        setIsEditing(false);
        toast.success("Content updated successfully!");
      } else {
        throw new Error("Failed to save content");
      }
    } catch (error) {
      console.error("Error saving content:", error);
      toast.error("Failed to save content");
    }
  };

  const handleCancel = () => {
    setEditValue(content?.content || defaultContent);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <Component className={`animate-pulse bg-gray-200 h-6 rounded ${className}`}>
        &nbsp;
      </Component>
    );
  }

  const displayContent = content?.content || defaultContent;

  if (isEditing && isAdmin && editable) {
    return (
      <Card className="p-4 border-dashed border-blue-500">
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            Editing: {contentKey}
          </div>
          {displayContent.length > 100 ? (
            <Textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="min-h-[100px]"
              placeholder={placeholder}
            />
          ) : (
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder={placeholder}
            />
          )}
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="relative group">
      <Component 
        className={className}
        style={{ whiteSpace: 'pre-wrap' }}
      >
        {displayContent || placeholder}
      </Component>
      
      {isAdmin && editable && !isEditing && (
        <Button
          size="sm"
          variant="ghost"
          className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleEdit}
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
} 
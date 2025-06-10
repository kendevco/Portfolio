"use client";

import { useState } from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Upload, ExternalLink } from "lucide-react";
import Image from "next/image";
import { toast } from "react-hot-toast";

interface ImageUploadProps {
  title: string;
  description?: string;
  endpoint: "profileImage" | "projectImage" | "homePageImage" | "generalFile";
  value?: string;
  onChange: (url?: string) => void;
  className?: string;
}

export function ImageUpload({
  title,
  description,
  endpoint,
  value,
  onChange,
  className
}: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState("");

  const handleRemove = () => {
    onChange("");
  };

  const handleManualUrl = () => {
    if (imageUrl.trim()) {
      onChange(imageUrl.trim());
      setImageUrl("");
      toast.success("Image URL added successfully");
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">
        {value && (
          <div className="relative">
            <div className="relative w-full h-48 rounded-lg overflow-hidden border">
              <Image
                src={value}
                alt="Uploaded image"
                fill
                className="object-cover"
              />
              <Button
                onClick={handleRemove}
                className="absolute top-2 right-2"
                size="icon"
                variant="destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Input
                value={value}
                readOnly
                className="flex-1"
              />
              <Button
                onClick={() => window.open(value, '_blank')}
                size="icon"
                variant="outline"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {!value && (
          <>
            <UploadDropzone
              endpoint={endpoint}
              onClientUploadComplete={(res) => {
                if (res?.[0]) {
                  onChange(res[0].url);
                  toast.success("Image uploaded successfully");
                }
              }}
              onUploadError={(error: Error) => {
                toast.error(`Upload failed: ${error.message}`);
              }}
              className="border-dashed border-2 border-gray-300 dark:border-gray-600"
            />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or enter URL manually
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Enter image URL..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleManualUrl()}
              />
              <Button onClick={handleManualUrl} disabled={!imageUrl.trim()}>
                <Upload className="h-4 w-4 mr-2" />
                Add URL
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
} 
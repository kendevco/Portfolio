import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Save, RefreshCw } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings className="h-8 w-8" />
          Admin Settings
        </h1>
        <p className="text-muted-foreground">
          Configure your portfolio settings and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Site Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site-title">Site Title</Label>
              <Input 
                id="site-title" 
                placeholder="Kenneth Courtney | Personal Portfolio" 
                defaultValue="Kenneth Courtney | Personal Portfolio"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="site-description">Site Description</Label>
              <Textarea 
                id="site-description" 
                placeholder="Ken is a full-stack developer with 15 years of experience."
                defaultValue="Ken is a full-stack developer with 15 years of experience."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">Contact Email</Label>
              <Input 
                id="contact-email" 
                type="email"
                placeholder="your@email.com" 
              />
            </div>
            <Button className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Save Site Settings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="resend-key">Resend API Key</Label>
              <Input 
                id="resend-key" 
                type="password"
                placeholder="re_••••••••••••••••••••••••••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="uploadthing-key">UploadThing API Key</Label>
              <Input 
                id="uploadthing-key" 
                type="password"
                placeholder="sk_live_••••••••••••••••••••••••••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vapi-key">VAPI Public Key</Label>
              <Input 
                id="vapi-key" 
                type="password"
                placeholder="b42e5bf6-••••-••••-••••-••••••••••••"
              />
            </div>
            <Button variant="outline" className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Test API Connections
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="max-projects">Max Projects Display</Label>
              <Input 
                id="max-projects" 
                type="number"
                placeholder="6" 
                defaultValue="6"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-experiences">Max Experiences Display</Label>
              <Input 
                id="max-experiences" 
                type="number"
                placeholder="5" 
                defaultValue="5"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="show-contact" defaultChecked />
              <Label htmlFor="show-contact">Show Contact Form</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="enable-animations" defaultChecked />
              <Label htmlFor="enable-animations">Enable Animations</Label>
            </div>
            <Button className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Save Content Settings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cache & Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Cache Status</Label>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm">All caches healthy</span>
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Clear All Caches
            </Button>
            <Button variant="outline" className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Regenerate Static Pages
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
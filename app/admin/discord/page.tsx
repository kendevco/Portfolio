"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  MessageSquare, 
  Send, 
  Settings, 
  Workflow,
  Database,
  ExternalLink
} from "lucide-react";

export default function DiscordIntegrationPage() {
  const [selectedServer, setSelectedServer] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("");
  const [message, setMessage] = useState("");
  const [sourceSystem, setSourceSystem] = useState("portfolio");

  // Mock data - replace with actual API calls
  const servers = [
    { id: "server1", name: "Kendev Server" },
    { id: "server2", name: "Portfolio Server" },
    { id: "server3", name: "Development Server" },
  ];

  const channels = [
    { id: "channel1", name: "general", serverId: "server1" },
    { id: "channel2", name: "portfolio-updates", serverId: "server1" },
    { id: "channel3", name: "projects", serverId: "server1" },
    { id: "channel4", name: "announcements", serverId: "server2" },
  ];

  const filteredChannels = channels.filter(channel => 
    channel.serverId === selectedServer
  );

  const handleSendMessage = async () => {
    if (!selectedServer || !selectedChannel || !message) {
      alert("Please fill in all fields");
      return;
    }

    // Here you would integrate with your n8n workflow
    console.log("Sending message:", {
      server: selectedServer,
      channel: selectedChannel,
      message,
      source: sourceSystem
    });

    alert("Message sent to Discord! (This would trigger the n8n workflow)");
    setMessage("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Discord Integration</h1>
        <p className="text-muted-foreground">
          Send portfolio updates to Discord channels via n8n workflows.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Send Message Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Send to Discord
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="server">Discord Server</Label>
              <Select value={selectedServer} onValueChange={setSelectedServer}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a server" />
                </SelectTrigger>
                <SelectContent>
                  {servers.map((server) => (
                    <SelectItem key={server.id} value={server.id}>
                      {server.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="channel">Channel</Label>
              <Select 
                value={selectedChannel} 
                onValueChange={setSelectedChannel}
                disabled={!selectedServer}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a channel" />
                </SelectTrigger>
                <SelectContent>
                  {filteredChannels.map((channel) => (
                    <SelectItem key={channel.id} value={channel.id}>
                      #{channel.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="source">Source System</Label>
              <Select value={sourceSystem} onValueChange={setSourceSystem}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="portfolio">Portfolio</SelectItem>
                  <SelectItem value="admin">Admin Panel</SelectItem>
                  <SelectItem value="automation">Automation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Enter your message to send to Discord..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />
            </div>

            <Button 
              onClick={handleSendMessage}
              className="w-full"
              disabled={!selectedServer || !selectedChannel || !message}
            >
              <Send className="h-4 w-4 mr-2" />
              Send to Discord
            </Button>
          </CardContent>
        </Card>

        {/* Integration Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Workflow className="h-5 w-5" />
              Integration Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">n8n Workflow</span>
                <span className="text-sm text-green-600">●  Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Discord Bot</span>
                <span className="text-sm text-green-600">●  Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Database Connection</span>
                <span className="text-sm text-green-600">●  Online</span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-2">Quick Actions</h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Webhook
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Database className="h-4 w-4 mr-2" />
                  View Message Store
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open n8n Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* n8n Workflow Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>n8n Workflow Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Workflow Endpoint</h4>
              <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                POST https://your-n8n-instance.com/webhook/portfolio-discord
              </code>
            </div>
            <div>
              <h4 className="font-medium mb-2">Required Payload Structure</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`{
  "server": "discord_server_id",
  "channel": "discord_channel_id", 
  "message": "Message content",
  "source": "portfolio|admin|automation",
  "timestamp": "ISO_8601_timestamp",
  "metadata": {
    "user_id": "clerk_user_id",
    "content_type": "experience|project|general"
  }
}`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
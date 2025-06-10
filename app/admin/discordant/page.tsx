"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus, Save, Settings, TestTube, CheckCircle, XCircle, MessageCircle, Bot, ExternalLink, AlertTriangle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";

interface DiscordantIntegration {
  id: string;
  discordantBaseUrl: string;
  apiToken: string;
  serverId?: string;
  serverName?: string;
  channelId?: string;
  channelName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SetupStatus {
  hasApiToken: boolean;
  hasBaseUrl: boolean;
  hasPortfolioChannelId: boolean;
  hasVapiChannelId: boolean;
}

export default function DiscordantAdminPage() {
  const { isLoaded, userId } = useAuth();
  const [integrations, setIntegrations] = useState<DiscordantIntegration[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIntegration, setEditingIntegration] = useState<DiscordantIntegration | null>(null);
  const [testingConnection, setTestingConnection] = useState(false);
  const [setupStatus, setSetupStatus] = useState<SetupStatus | null>(null);
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [activeTest, setActiveTest] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    discordantBaseUrl: "",
    apiToken: "",
    serverId: "",
    serverName: "",
    channelId: "",
    channelName: "",
    isActive: true
  });

  useEffect(() => {
    if (isLoaded && userId) {
      fetchIntegrations();
      fetchSetupStatus();
    }
  }, [isLoaded, userId]);

  const fetchIntegrations = async () => {
    try {
      const response = await fetch("/api/discordant/integrations");
      if (response.ok) {
        const data = await response.json();
        setIntegrations(data);
      }
    } catch (error) {
      console.error("Error fetching integrations:", error);
      toast.error("Failed to fetch integrations");
    } finally {
      setLoading(false);
    }
  };

  const fetchSetupStatus = async () => {
    try {
      const response = await fetch("/api/discordant/setup");
      if (response.ok) {
        const data = await response.json();
        setSetupStatus(data.environment);
      } else {
        toast.error("Failed to fetch setup status");
      }
    } catch (error) {
      console.error("Error fetching setup status:", error);
      toast.error("Failed to fetch setup status");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingIntegration 
        ? `/api/discordant/integrations/${editingIntegration.id}` 
        : "/api/discordant/integrations";
      const method = editingIntegration ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success(editingIntegration ? "Integration updated!" : "Integration created!");
        fetchIntegrations();
        resetForm();
        setIsDialogOpen(false);
      } else {
        throw new Error("Failed to save integration");
      }
    } catch (error) {
      console.error("Error saving integration:", error);
      toast.error("Failed to save integration");
    }
  };

  const handleEdit = (integration: DiscordantIntegration) => {
    setEditingIntegration(integration);
    setFormData({
      discordantBaseUrl: integration.discordantBaseUrl,
      apiToken: integration.apiToken,
      serverId: integration.serverId || "",
      serverName: integration.serverName || "",
      channelId: integration.channelId || "",
      channelName: integration.channelName || "",
      isActive: integration.isActive
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this integration?")) return;

    try {
      const response = await fetch(`/api/discordant/integrations/${id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        toast.success("Integration deleted!");
        fetchIntegrations();
      } else {
        throw new Error("Failed to delete integration");
      }
    } catch (error) {
      console.error("Error deleting integration:", error);
      toast.error("Failed to delete integration");
    }
  };

  const testConnection = async () => {
    if (!formData.discordantBaseUrl || !formData.apiToken) {
      toast.error("Please provide base URL and API token");
      return;
    }

    setTestingConnection(true);
    try {
      const response = await fetch(`${formData.discordantBaseUrl}/api/health`, {
        headers: {
          'Authorization': `Bearer ${formData.apiToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success("Connection successful!");
      } else {
        throw new Error(`Connection failed: ${response.status}`);
      }
    } catch (error) {
      console.error("Connection test failed:", error);
      toast.error("Connection test failed");
    } finally {
      setTestingConnection(false);
    }
  };

  const resetForm = () => {
    setFormData({
      discordantBaseUrl: "",
      apiToken: "",
      serverId: "",
      serverName: "",
      channelId: "",
      channelName: "",
      isActive: true
    });
    setEditingIntegration(null);
  };

  const createDefaultIntegration = () => {
    setFormData({
      discordantBaseUrl: "https://discordant.kendev.co",
      apiToken: "",
      serverId: "",
      serverName: "KenDev Home Portal",
      channelId: "",
      channelName: "website-visitors",
      isActive: true
    });
    setIsDialogOpen(true);
  };

  const runTest = async (action: string, title: string) => {
    setActiveTest(action);
    try {
      const response = await fetch("/api/discordant/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action })
      });

      const result = await response.json();
      setTestResults(prev => ({ ...prev, [action]: result }));

      if (result.success) {
        toast.success(`${title} completed successfully!`);
      } else {
        toast.error(`${title} failed: ${result.error}`);
      }
    } catch (error) {
      console.error(`${title} error:`, error);
      toast.error(`${title} failed`);
      setTestResults(prev => ({ 
        ...prev, 
        [action]: { success: false, error: error instanceof Error ? error.message : 'Unknown error' } 
      }));
    } finally {
      setActiveTest(null);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isConfigured = setupStatus && 
    setupStatus.hasApiToken && 
    setupStatus.hasBaseUrl && 
    setupStatus.hasPortfolioChannelId;

  return (
    <div className="space-y-8">
              <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Discordant Integration</h2>
            <p className="text-muted-foreground">
              Manage and test your Discordant chat integration
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => window.open('/test-integration', '_blank')}
              className="text-sm"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Quick Test
            </Button>
            <Badge variant={isConfigured ? "default" : "destructive"}>
              {isConfigured ? "Configured" : "Setup Required"}
            </Badge>
          </div>
        </div>

      {/* Configuration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuration Status
          </CardTitle>
          <CardDescription>
            Environment variables and basic setup requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <span>API Token</span>
              {setupStatus?.hasApiToken ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
            </div>
            <div className="flex items-center justify-between">
              <span>Base URL</span>
              {setupStatus?.hasBaseUrl ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
            </div>
            <div className="flex items-center justify-between">
              <span>Portfolio Channel</span>
              {setupStatus?.hasPortfolioChannelId ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
            </div>
            <div className="flex items-center justify-between">
              <span>VAPI Channel</span>
              {setupStatus?.hasVapiChannelId ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
            </div>
          </div>

          {!isConfigured && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Please configure your environment variables. Check the{" "}
                <a 
                  href="/docs/discordant-integration.md" 
                  className="underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  setup guide <ExternalLink className="h-3 w-3 inline" />
                </a>
                {" "}for details.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Integration Tests */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Connection Test
            </CardTitle>
            <CardDescription>
              Test basic connectivity to Discordant
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => runTest("test-connection", "Connection Test")}
              disabled={!isConfigured || activeTest === "test-connection"}
              className="w-full"
            >
              {activeTest === "test-connection" ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <TestTube className="h-4 w-4 mr-2" />
              )}
              Test Connection
            </Button>

            {testResults["test-connection"] && (
              <div className={`p-3 rounded-lg text-sm ${
                testResults["test-connection"].success 
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  {testResults["test-connection"].success ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  <strong>
                    {testResults["test-connection"].success ? "Success" : "Failed"}
                  </strong>
                </div>
                <p>{testResults["test-connection"].message || testResults["test-connection"].error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Create Agents
            </CardTitle>
            <CardDescription>
              Set up AI assistant and system bot users
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => runTest("create-agents", "Agent Creation")}
              disabled={!isConfigured || activeTest === "create-agents"}
              className="w-full"
            >
              {activeTest === "create-agents" ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Bot className="h-4 w-4 mr-2" />
              )}
              Create Agents
            </Button>

            {testResults["create-agents"] && (
              <div className={`p-3 rounded-lg text-sm ${
                testResults["create-agents"].success 
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  {testResults["create-agents"].success ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  <strong>
                    {testResults["create-agents"].success ? "Success" : "Failed"}
                  </strong>
                </div>
                <p>{testResults["create-agents"].message || testResults["create-agents"].error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Test Message
            </CardTitle>
            <CardDescription>
              Send a test message through the system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => runTest("send-test-message", "Test Message")}
              disabled={!isConfigured || activeTest === "send-test-message"}
              className="w-full"
            >
              {activeTest === "send-test-message" ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <MessageCircle className="h-4 w-4 mr-2" />
              )}
              Send Test
            </Button>

            {testResults["send-test-message"] && (
              <div className={`p-3 rounded-lg text-sm ${
                testResults["send-test-message"].success 
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  {testResults["send-test-message"].success ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  <strong>
                    {testResults["send-test-message"].success ? "Success" : "Failed"}
                  </strong>
                </div>
                <p>{testResults["send-test-message"].message || testResults["send-test-message"].error}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Integration Features */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Features</CardTitle>
          <CardDescription>
            Available features when properly configured
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Chat Integration</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Embedded chat widget on portfolio</li>
                <li>• Real-time messaging via Discordant</li>
                <li>• Session tracking and visitor management</li>
                <li>• Mobile-responsive chat interface</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Contact Form Integration</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Automatic forwarding to Discordant</li>
                <li>• AI processing via n8n workflows</li>
                <li>• Email notifications and responses</li>
                <li>• Lead capture and management</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">VAPI Integration</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Voice call transcript processing</li>
                <li>• Real-time conversation streaming</li>
                <li>• Call summary and action items</li>
                <li>• Follow-up workflow automation</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">AI Workflows</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Automated responses via n8n</li>
                <li>• Calendar management integration</li>
                <li>• GSA research and lead qualification</li>
                <li>• Multi-tool AI agent capabilities</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Discordant Integration</h2>
          <p className="text-muted-foreground">
            Manage connections to your Discordant servers for chat integration
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={createDefaultIntegration} variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Setup KenDev
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Integration
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingIntegration ? "Edit Integration" : "Create New Integration"}
                </DialogTitle>
                <DialogDescription>
                  Configure the connection to your Discordant server
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="baseUrl">Discordant Base URL</Label>
                    <Input
                      id="baseUrl"
                      value={formData.discordantBaseUrl}
                      onChange={(e) => setFormData({...formData, discordantBaseUrl: e.target.value})}
                      placeholder="https://your-discordant.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apiToken">API Token</Label>
                    <Input
                      id="apiToken"
                      type="password"
                      value={formData.apiToken}
                      onChange={(e) => setFormData({...formData, apiToken: e.target.value})}
                      placeholder="Your API token"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={testConnection}
                    disabled={testingConnection}
                  >
                    {testingConnection ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                        Testing...
                      </>
                    ) : (
                      <>
                        <TestTube className="h-4 w-4 mr-2" />
                        Test Connection
                      </>
                    )}
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="serverId">Server ID (Optional)</Label>
                    <Input
                      id="serverId"
                      value={formData.serverId}
                      onChange={(e) => setFormData({...formData, serverId: e.target.value})}
                      placeholder="Default server ID"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serverName">Server Name</Label>
                    <Input
                      id="serverName"
                      value={formData.serverName}
                      onChange={(e) => setFormData({...formData, serverName: e.target.value})}
                      placeholder="Server display name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="channelId">Channel ID (Optional)</Label>
                    <Input
                      id="channelId"
                      value={formData.channelId}
                      onChange={(e) => setFormData({...formData, channelId: e.target.value})}
                      placeholder="Default channel ID"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="channelName">Channel Name</Label>
                    <Input
                      id="channelName"
                      value={formData.channelName}
                      onChange={(e) => setFormData({...formData, channelName: e.target.value})}
                      placeholder="Channel display name"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                  />
                  <Label htmlFor="active">Active</Label>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    {editingIntegration ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Integration Cards */}
      <div className="grid gap-6">
        {integrations.map((integration) => (
          <Card key={integration.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    {integration.serverName || "Discordant Integration"}
                    <Badge variant={integration.isActive ? "default" : "secondary"}>
                      {integration.isActive ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3 mr-1" />
                          Inactive
                        </>
                      )}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {integration.discordantBaseUrl}
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(integration)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(integration.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Server:</span> {integration.serverName || "Not set"}
                </div>
                <div>
                  <span className="font-medium">Channel:</span> {integration.channelName || "Not set"}
                </div>
                <div>
                  <span className="font-medium">Server ID:</span> {integration.serverId || "Dynamic"}
                </div>
                <div>
                  <span className="font-medium">Channel ID:</span> {integration.channelId || "Dynamic"}
                </div>
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                Updated: {new Date(integration.updatedAt).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {integrations.length === 0 && !loading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Settings className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No integrations configured</h3>
            <p className="text-muted-foreground text-center mb-4">
              Set up your first Discordant integration to enable chat functionality.
            </p>
            <Button onClick={createDefaultIntegration}>
              Setup KenDev Integration
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 
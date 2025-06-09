"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Database, 
  Play, 
  Copy, 
  Download,
  Code,
  MessageSquare
} from "lucide-react";

export default function DatabaseQueryPage() {
  const [selectedQuery, setSelectedQuery] = useState("");
  const [customQuery, setCustomQuery] = useState("");
  const [queryResults, setQueryResults] = useState("");

  const predefinedQueries = [
    {
      id: "recent-messages",
      name: "Recent Messages",
      description: "Get recent messages from all servers",
      query: `-- Get recent messages with member and server info
SELECT 
  m.id,
  m.content,
  m.createdAt,
  p.name as memberName,
  s.name as serverName,
  c.name as channelName
FROM message m
JOIN member mem ON m.memberId = mem.id
JOIN profile p ON mem.profileId = p.id
JOIN channel c ON m.channelId = c.id
JOIN server s ON c.serverId = s.id
WHERE m.deleted = false
ORDER BY m.createdAt DESC
LIMIT 50;`
    },
    {
      id: "server-stats",
      name: "Server Statistics",
      description: "Get message counts per server",
      query: `-- Server message statistics
SELECT 
  s.id,
  s.name as serverName,
  COUNT(m.id) as messageCount,
  COUNT(DISTINCT mem.id) as uniqueMembers,
  COUNT(DISTINCT c.id) as channelCount
FROM server s
LEFT JOIN channel c ON s.id = c.serverId
LEFT JOIN message m ON c.id = m.channelId AND m.deleted = false
LEFT JOIN member mem ON s.id = mem.serverId
GROUP BY s.id, s.name
ORDER BY messageCount DESC;`
    },
    {
      id: "channel-activity",
      name: "Channel Activity",
      description: "Most active channels by message count",
      query: `-- Channel activity analysis
SELECT 
  c.id,
  c.name as channelName,
  s.name as serverName,
  c.type,
  COUNT(m.id) as messageCount,
  MAX(m.createdAt) as lastMessage
FROM channel c
JOIN server s ON c.serverId = s.id
LEFT JOIN message m ON c.id = m.channelId AND m.deleted = false
GROUP BY c.id, c.name, s.name, c.type
ORDER BY messageCount DESC
LIMIT 20;`
    },
    {
      id: "member-activity",
      name: "Member Activity",
      description: "Most active members across all servers",
      query: `-- Member activity statistics
SELECT 
  p.id,
  p.name,
  p.email,
  COUNT(m.id) as messageCount,
  COUNT(DISTINCT s.id) as serverCount,
  MAX(m.createdAt) as lastActivity
FROM profile p
JOIN member mem ON p.id = mem.profileId
JOIN message m ON mem.id = m.memberId AND m.deleted = false
JOIN channel c ON m.channelId = c.id
JOIN server s ON c.serverId = s.id
GROUP BY p.id, p.name, p.email
ORDER BY messageCount DESC
LIMIT 20;`
    },
    {
      id: "portfolio-integration",
      name: "Portfolio Integration Data",
      description: "Data suitable for portfolio site integration",
      query: `-- Portfolio integration query
SELECT 
  'discord_message' as contentType,
  m.content as title,
  SUBSTRING(m.content, 1, 200) as description,
  m.createdAt as date,
  p.name as author,
  s.name as source,
  c.name as category
FROM message m
JOIN member mem ON m.memberId = mem.id
JOIN profile p ON mem.profileId = p.id
JOIN channel c ON m.channelId = c.id
JOIN server s ON c.serverId = s.id
WHERE m.deleted = false
  AND m.content IS NOT NULL
  AND LENGTH(m.content) > 10
ORDER BY m.createdAt DESC
LIMIT 100;`
    }
  ];

  const handleRunQuery = async () => {
    const queryToRun = selectedQuery ? 
      predefinedQueries.find(q => q.id === selectedQuery)?.query : 
      customQuery;

    if (!queryToRun) {
      alert("Please select a query or enter a custom query");
      return;
    }

    // Simulate query execution
    setQueryResults(`-- Query executed at ${new Date().toISOString()}
-- Note: This is a simulation. Connect to your actual Discordant database.

Results would appear here...

Example output:
{
  "rows": [
    {
      "id": "msg_123",
      "content": "Sample Discord message",
      "memberName": "John Doe",
      "serverName": "Kendev Server",
      "channelName": "general",
      "createdAt": "2024-01-01T12:00:00Z"
    }
  ],
  "rowCount": 1,
  "duration": "23ms"
}`);
  };

  const handleCopyQuery = () => {
    const queryToCopy = selectedQuery ? 
      predefinedQueries.find(q => q.id === selectedQuery)?.query : 
      customQuery;
    
    if (queryToCopy) {
      navigator.clipboard.writeText(queryToCopy);
      alert("Query copied to clipboard!");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Database Query Interface</h1>
        <p className="text-muted-foreground">
          Query the Discordant database for portfolio integration and analytics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Query Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Query Builder
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Predefined Queries</Label>
              <Select value={selectedQuery} onValueChange={setSelectedQuery}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a predefined query" />
                </SelectTrigger>
                <SelectContent>
                  {predefinedQueries.map((query) => (
                    <SelectItem key={query.id} value={query.id}>
                      {query.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedQuery && (
                <p className="text-sm text-muted-foreground">
                  {predefinedQueries.find(q => q.id === selectedQuery)?.description}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Custom Query</Label>
              <Textarea
                placeholder="Enter your custom SQL query here..."
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                rows={8}
                className="font-mono text-sm"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleRunQuery} className="flex-1">
                <Play className="h-4 w-4 mr-2" />
                Run Query
              </Button>
              <Button variant="outline" onClick={handleCopyQuery}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Connection Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Discordant Connection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Database Type</span>
                <span className="text-sm text-muted-foreground">MySQL</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Host</span>
                <span className="text-sm text-muted-foreground">kendev.co:3306</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Database</span>
                <span className="text-sm text-muted-foreground">discordant</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Connection Status</span>
                <span className="text-sm text-green-600">●  Connected</span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-2">Connection String</h4>
              <code className="bg-gray-100 px-2 py-1 rounded text-xs block">
                mysql://discordant:K3nD3v!discordant@kendev.co:3306/discordant
              </code>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Available Tables</h4>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <span>• profile</span>
                <span>• server</span>
                <span>• member</span>
                <span>• channel</span>
                <span>• message</span>
                <span>• conversation</span>
                <span>• directmessage</span>
                <span>• serveractivity</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Query Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Query Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {queryResults ? (
              <div>
                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                  {queryResults}
                </pre>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button variant="outline" size="sm">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Results
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">
                Run a query to see results here.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Query Templates for n8n Integration */}
      <Card>
        <CardHeader>
          <CardTitle>n8n Integration Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Webhook Payload for Portfolio Updates</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`// n8n workflow to sync Discord data to Portfolio
{
  "trigger": "discord_message",
  "data": {
    "content": "{{ $json.content }}",
    "author": "{{ $json.memberName }}",
    "server": "{{ $json.serverName }}",
    "channel": "{{ $json.channelName }}",
    "timestamp": "{{ $json.createdAt }}"
  },
  "target": {
    "system": "portfolio",
    "endpoint": "/api/discord/sync",
    "method": "POST"
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
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, PhoneCall, CheckCircle, Bot, Calendar, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";

interface VapiEvent {
  id: string;
  type: string;
  data: string;
  timestamp: string;
  processed: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function VapiAdminPage() {
  const [events, setEvents] = useState<VapiEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/vapi/events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        toast.error('Failed to fetch VAPI events');
      }
    } catch (error) {
      console.error('Error fetching VAPI events:', error);
      toast.error('Failed to fetch VAPI events');
    } finally {
      setLoading(false);
    }
  };

  const markAsProcessed = async (eventId: string) => {
    try {
      const response = await fetch(`/api/vapi/events/${eventId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ processed: true }),
      });

      if (response.ok) {
        setEvents(events.map(event => 
          event.id === eventId ? { ...event, processed: true } : event
        ));
        toast.success('Event marked as processed');
      } else {
        toast.error('Failed to update event');
      }
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event');
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'call-start':
        return <Phone className="h-4 w-4" />;
      case 'call-end':
        return <PhoneCall className="h-4 w-4" />;
      case 'workflow-complete':
        return <CheckCircle className="h-4 w-4" />;
      case 'assistant-request':
        return <Bot className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'call-start':
        return 'bg-green-100 text-green-800';
      case 'call-end':
        return 'bg-red-100 text-red-800';
      case 'workflow-complete':
        return 'bg-blue-100 text-blue-800';
      case 'assistant-request':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">VAPI Events</h1>
          <p className="text-muted-foreground">
            Monitor and manage VAPI webhook events and workflow completions.
          </p>
        </div>
        <Button onClick={fetchEvents} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events.filter(e => e.processed).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <RefreshCw className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events.filter(e => !e.processed).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {events.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No VAPI Events</h3>
                <p className="text-muted-foreground">
                  VAPI webhook events will appear here when they are received.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          events.map((event) => (
            <Card key={event.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getEventIcon(event.type)}
                    <div>
                      <CardTitle className="text-lg">{event.type}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getEventColor(event.type)}>
                      {event.type}
                    </Badge>
                    {event.processed ? (
                      <Badge variant="secondary">Processed</Badge>
                    ) : (
                      <Badge variant="destructive">Pending</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Event Data:</h4>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm overflow-x-auto">
                      {JSON.stringify(JSON.parse(event.data), null, 2)}
                    </pre>
                  </div>
                  {!event.processed && (
                    <Button 
                      onClick={() => markAsProcessed(event.id)}
                      size="sm"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Processed
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 
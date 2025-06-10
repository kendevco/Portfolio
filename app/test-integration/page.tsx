'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Send, Info, AlertTriangle } from 'lucide-react';

interface EnvironmentStatus {
  hasApiToken: boolean;
  hasBaseUrl: boolean;
  hasChannelId: boolean;
  baseUrl: string;
  channelId: string;
}

export default function TestIntegration() {
  const [message, setMessage] = useState('Hello from Portfolio! 🎯 Integration test successful.');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [envStatus, setEnvStatus] = useState<EnvironmentStatus | null>(null);
  const [lastTest, setLastTest] = useState<any>(null);

  useEffect(() => {
    checkEnvironment();
  }, []);

  const checkEnvironment = async () => {
    try {
      const response = await fetch('/api/test-discordant');
      const data = await response.json();
      setEnvStatus(data.environment);
    } catch (error) {
      console.error('Environment check failed:', error);
    }
  };

  const sendTest = async () => {
    setLoading(true);
    setResult('');
    
    try {
      const response = await fetch('/api/test-discordant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      
      const data = await response.json();
      setLastTest(data);
      setResult(JSON.stringify(data, null, 2));
      
    } catch (error) {
      const errorResult = { success: false, error: error instanceof Error ? error.message : String(error) };
      setLastTest(errorResult);
      setResult(JSON.stringify(errorResult, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const isConfigured = envStatus && envStatus.hasApiToken && envStatus.hasBaseUrl && envStatus.hasChannelId;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-4xl px-4 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">🔗 Discordant Integration Test</h1>
          <p className="text-gray-600">Test the Portfolio → Discordant → n8n pipeline</p>
        </div>

        {/* Environment Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Environment Configuration
              <Badge variant={isConfigured ? "default" : "destructive"}>
                {isConfigured ? "Ready" : "Setup Required"}
              </Badge>
            </CardTitle>
            <CardDescription>
              Check if all required environment variables are configured
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between">
                <span>API Token</span>
                {envStatus?.hasApiToken ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span>Base URL</span>
                {envStatus?.hasBaseUrl ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span>Channel ID</span>
                {envStatus?.hasChannelId ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
              </div>
            </div>
            
            {envStatus && (
              <div className="mt-4 p-3 bg-gray-50 rounded text-sm space-y-1">
                <div><strong>Base URL:</strong> {envStatus.baseUrl || 'Not set'}</div>
                <div><strong>Channel ID:</strong> {envStatus.channelId || 'Not set'}</div>
              </div>
            )}

            {!isConfigured && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div className="text-sm">
                    <strong>Setup Required:</strong> Add these to your <code>.env.local</code>:
                    <pre className="mt-2 p-2 bg-gray-800 text-green-400 text-xs rounded overflow-x-auto">
{`DISCORDANT_API_TOKEN=disc_your_token_here
DISCORDANT_BASE_URL=http://localhost:3000
DISCORDANT_PORTFOLIO_CHANNEL_ID=your_channel_id`}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test Interface */}
        <Card>
          <CardHeader>
            <CardTitle>Send Test Message</CardTitle>
            <CardDescription>
              This will send a message to your Discordant channel and trigger the n8n workflow
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Test Message
              </label>
              <Input
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter test message..."
                className="w-full"
              />
            </div>
            
            <Button 
              onClick={sendTest} 
              disabled={loading || !isConfigured}
              className="w-full"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              {loading ? 'Sending to Discordant...' : 'Send Test Message'}
            </Button>

            {/* Last Test Result */}
            {lastTest && (
              <div className={`p-3 rounded-lg border ${
                lastTest.success 
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  {lastTest.success ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  <strong>
                    {lastTest.success ? 'Test Successful!' : 'Test Failed'}
                  </strong>
                </div>
                <p className="text-sm">
                  {lastTest.message || lastTest.error}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>
                Raw response from the integration test
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto whitespace-pre-wrap">
                {result}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Testing Steps</CardTitle>
            <CardDescription>
              Follow these steps to verify the full integration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li><strong>Configure Environment:</strong> Add required environment variables above</li>
              <li><strong>Start Discordant:</strong> Run your Discordant instance (usually port 3000)</li>
              <li><strong>Send Test Message:</strong> Use the form above to send a test message</li>
              <li><strong>Check Discordant:</strong> Verify message appears in your portfolio channel</li>
              <li><strong>Check n8n:</strong> Confirm your n8n.kendev.co workflow is triggered</li>
              <li><strong>Check AI Response:</strong> Look for AI response back in Discordant channel</li>
            </ol>
            
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm">
                <strong>Expected Flow:</strong><br />
                Portfolio Test → Discordant Channel → n8n Webhook → AI Processing → Response in Discordant
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
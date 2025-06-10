import { useState, useEffect } from 'react';

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

export function useContent(key: string, defaultContent: string = '') {
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/content?key=${key}`);
        
        if (response.ok) {
          const data = await response.json();
          setContent(data);
        } else if (response.status === 404) {
          // Content doesn't exist yet
          setContent(null);
        } else {
          throw new Error('Failed to fetch content');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching content:', err);
      } finally {
        setLoading(false);
      }
    };

    if (key) {
      fetchContent();
    }
  }, [key]);

  const getContent = () => {
    return content?.content || defaultContent;
  };

  const refresh = async () => {
    if (key) {
      const response = await fetch(`/api/content?key=${key}`);
      if (response.ok) {
        const data = await response.json();
        setContent(data);
      }
    }
  };

  return {
    content,
    loading,
    error,
    getContent,
    refresh
  };
} 
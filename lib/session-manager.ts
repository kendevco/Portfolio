import { nanoid } from 'nanoid';

export interface VisitorSession {
  sessionId: string;
  userId?: string;
  name?: string;
  email?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  lastSeen: Date;
  metadata: Record<string, any>;
}

class SessionManager {
  private static readonly SESSION_KEY = 'portfolio_session_id';
  private static readonly SESSION_DATA_KEY = 'portfolio_session_data';

  /**
   * Get or create a session ID
   */
  static getSessionId(): string {
    if (typeof window === 'undefined') {
      return nanoid();
    }

    let sessionId = localStorage.getItem(this.SESSION_KEY);
    if (!sessionId) {
      sessionId = nanoid();
      localStorage.setItem(this.SESSION_KEY, sessionId);
    }

    return sessionId;
  }

  /**
   * Get current session data
   */
  static getSessionData(): Partial<VisitorSession> | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const data = localStorage.getItem(this.SESSION_DATA_KEY);
    if (!data) return null;

    try {
      const parsed = JSON.parse(data);
      return {
        ...parsed,
        createdAt: new Date(parsed.createdAt),
        lastSeen: new Date(parsed.lastSeen)
      };
    } catch {
      return null;
    }
  }

  /**
   * Update session data
   */
  static updateSessionData(data: Partial<VisitorSession>): void {
    if (typeof window === 'undefined') return;

    const existingData = this.getSessionData() || {};
    const updatedData = {
      ...existingData,
      ...data,
      sessionId: this.getSessionId(),
      lastSeen: new Date(),
      metadata: {
        ...existingData.metadata,
        ...data.metadata
      }
    };

    localStorage.setItem(this.SESSION_DATA_KEY, JSON.stringify(updatedData));
  }

  /**
   * Track page visit
   */
  static trackPageVisit(page: string, additionalData?: Record<string, any>): void {
    this.updateSessionData({
      metadata: {
        currentPage: page,
        pageVisitedAt: new Date().toISOString(),
        ...additionalData
      }
    });
  }

  /**
   * Set visitor identity (when they provide name/email)
   */
  static setVisitorIdentity(name: string, email: string): void {
    this.updateSessionData({
      name,
      email,
      metadata: {
        identityProvidedAt: new Date().toISOString()
      }
    });
  }

  /**
   * Link to authenticated user
   */
  static linkToUser(userId: string): void {
    this.updateSessionData({
      userId,
      metadata: {
        linkedToUserAt: new Date().toISOString()
      }
    });
  }

  /**
   * Get visitor data for Discordant integration
   */
  static getVisitorDataForDiscordant(): {
    sessionId: string;
    email?: string;
    name?: string;
    metadata: Record<string, any>;
  } {
    const sessionData = this.getSessionData();
    const sessionId = this.getSessionId();

    return {
      sessionId,
      email: sessionData?.email,
      name: sessionData?.name,
      metadata: {
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        ...sessionData?.metadata,
        lastActivity: new Date().toISOString()
      }
    };
  }

  /**
   * Clear session data
   */
  static clearSession(): void {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(this.SESSION_KEY);
    localStorage.removeItem(this.SESSION_DATA_KEY);
  }

  /**
   * Initialize session tracking
   */
  static initialize(): void {
    if (typeof window === 'undefined') return;

    // Ensure session ID exists
    this.getSessionId();

    // Track initial page load
    this.trackPageVisit(window.location.pathname, {
      referrer: document.referrer,
      timestamp: new Date().toISOString()
    });

    // Update last seen on page visibility change
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.updateSessionData({
          lastSeen: new Date()
        });
      }
    });

    // Track page navigation
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      SessionManager.trackPageVisit(window.location.pathname);
    };

    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      SessionManager.trackPageVisit(window.location.pathname);
    };

    window.addEventListener('popstate', () => {
      SessionManager.trackPageVisit(window.location.pathname);
    });
  }
}

export default SessionManager; 
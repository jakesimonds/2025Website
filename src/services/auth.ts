import { BskyAgent } from '@atproto/api';
import type { LoginCredentials, AuthState } from '../types/auth';

const STORAGE_KEY = 'bluesky_session';

export class AuthService {
  private agent: BskyAgent;

  constructor() {
    this.agent = new BskyAgent({
      service: 'https://bsky.social',
    });
  }

  getAgent(): BskyAgent {
    return this.agent;
  }

  async login(credentials: LoginCredentials): Promise<AuthState> {
    try {
      const response = await this.agent.login({
        identifier: credentials.identifier,
        password: credentials.password,
      });

      const authState: AuthState = {
        isAuthenticated: true,
        handle: response.data.handle,
        did: response.data.did,
        session: {
          accessJwt: response.data.accessJwt,
          refreshJwt: response.data.refreshJwt,
          handle: response.data.handle,
          did: response.data.did,
          active: true,
        },
      };

      // Persist session
      this.saveSession(authState);

      return authState;
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Login failed. Please check your credentials.');
    }
  }

  async resumeSession(): Promise<AuthState | null> {
    const savedSession = this.loadSession();

    if (!savedSession || !savedSession.session) {
      return null;
    }

    try {
      // Resume session with saved credentials
      await this.agent.resumeSession(savedSession.session);
      return savedSession;
    } catch (error) {
      console.error('Failed to resume session:', error);
      this.clearSession();
      return null;
    }
  }

  logout(): void {
    this.clearSession();
    this.agent = new BskyAgent({
      service: 'https://bsky.social',
    });
  }

  private saveSession(authState: AuthState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authState));
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  }

  private loadSession(): AuthState | null {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return null;

      const session = JSON.parse(saved);
      // Ensure active property exists (for backward compatibility)
      if (session.session && session.session.active === undefined) {
        session.session.active = true;
      }
      return session;
    } catch (error) {
      console.error('Failed to load session:', error);
      return null;
    }
  }

  private clearSession(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear session:', error);
    }
  }
}

export const authService = new AuthService();

export interface AuthState {
  isAuthenticated: boolean;
  handle?: string;
  did?: string;
  session?: {
    accessJwt: string;
    refreshJwt: string;
    handle: string;
    did: string;
    active: boolean;
  };
}

export interface LoginCredentials {
  identifier: string; // handle or email
  password: string; // app password
}

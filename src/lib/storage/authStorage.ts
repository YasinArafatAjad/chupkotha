import { nanoid } from 'nanoid';

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  photoURL: string;
}

class AuthStorage {
  private readonly AUTH_KEY = 'auth_user';

  getCurrentUser(): AuthUser | null {
    const userData = localStorage.getItem(this.AUTH_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  async login(email: string, password: string): Promise<AuthUser> {
    // In a real app, we'd validate against stored credentials
    // For demo, we'll create a new user if email doesn't exist
    const user: AuthUser = {
      id: nanoid(),
      email,
      displayName: email.split('@')[0],
      photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=random`
    };
    
    localStorage.setItem(this.AUTH_KEY, JSON.stringify(user));
    return user;
  }

  async logout(): Promise<void> {
    localStorage.removeItem(this.AUTH_KEY);
  }
}

export const authStorage = new AuthStorage();
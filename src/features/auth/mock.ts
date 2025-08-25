import { toast } from '@/components/ui/use-toast';

export type MockRole = 'admin' | 'user';
export interface MockUser {
  id: string;
  email: string;
  role: MockRole;
  password: string; // dummy only (plain text); DO NOT use in production
  createdAt: string;
}

const LS_USERS = 'mockdb.users';
const LS_CURRENT_USER_ID = 'mockdb.currentUserId';
const AUTH_EVENT = 'mock-auth-change';

function readUsers(): MockUser[] {
  try {
    const raw = localStorage.getItem(LS_USERS);
    if (!raw) return [];
    return JSON.parse(raw) as MockUser[];
  } catch {
    return [];
  }
}

function writeUsers(users: MockUser[]) {
  localStorage.setItem(LS_USERS, JSON.stringify(users));
}

function emitAuthChange() {
  window.dispatchEvent(new CustomEvent(AUTH_EVENT));
}

export function onAuthChange(callback: () => void) {
  const handler = () => callback();
  window.addEventListener(AUTH_EVENT, handler);
  return () => window.removeEventListener(AUTH_EVENT, handler);
}

export function getCurrentUser(): MockUser | null {
  try {
    const id = localStorage.getItem(LS_CURRENT_USER_ID);
    if (!id) return null;
    const users = readUsers();
    return users.find(u => u.id === id) || null;
  } catch {
    return null;
  }
}

export async function signUp(email: string, password: string): Promise<MockUser> {
  await new Promise(r => setTimeout(r, 400));
  const users = readUsers();
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('Email already registered');
  }
  const role: MockRole = 'user';
  const user: MockUser = {
    id: `u_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    email,
    role,
    password,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  writeUsers(users);
  localStorage.setItem(LS_CURRENT_USER_ID, user.id);
  emitAuthChange();
  toast({ title: 'Signed up', description: `Welcome, ${email}` });
  return user;
}

export async function signIn(email: string, password: string): Promise<MockUser> {
  await new Promise(r => setTimeout(r, 400));
  let users = readUsers();
  let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    // auto-provision for demo convenience
    const role: MockRole = email.includes('+admin@') || email.split('@')[0]?.toLowerCase().includes('admin') ? 'admin' : 'user';
    user = {
      id: `u_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      email,
      role,
      password,
      createdAt: new Date().toISOString(),
    };
    users = [...users, user];
    writeUsers(users);
  } else if (user.password !== password) {
    // relax password requirement in demo if empty stored
    if (user.password && user.password !== password) {
      throw new Error('Invalid credentials');
    }
  }
  localStorage.setItem(LS_CURRENT_USER_ID, user.id);
  emitAuthChange();
  toast({ title: 'Signed in', description: `Signed in as ${user.role}` });
  return user;
}

export async function signOut(): Promise<void> {
  await new Promise(r => setTimeout(r, 200));
  localStorage.removeItem(LS_CURRENT_USER_ID);
  emitAuthChange();
  toast({ title: 'Signed out', description: 'You have been signed out' });
}



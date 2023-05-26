export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  isManager?: boolean;
  createdAt: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AccountCreationInfo {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface Team {
  id: number;
  name: string;
  manager: User;
  sport: string;
  createdAt: string;
}

export interface Event {
  id: number;
  name: string;
  team: Team;
  startTime: string;
  endTime: string;
  eventType: string;
  teamScore: number;
  opponentScore: number;
  createdAt: string;
}

export interface Participant {
  id: number;
  user: User;
  event: Event;
  attendance: string;
}

export interface TeamInvite {
  id: number;
  token: string;
  team: Team;
  email: string;
  state: string;
  createdAt: string;
}
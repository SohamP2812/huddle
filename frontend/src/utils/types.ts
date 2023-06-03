export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string; 
  profilePictureUrl?: string;
  createdAt: string;
}

export interface Member {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  isManager: boolean;  
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
  notes: string;
  address: string;
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
  position: string;
  createdAt: string;
}

export interface TeamAlbum {
  id: number;
  name: string;
  createdAt: string;
}

export interface TeamImage {
  id: number;
  url: string
  createdAt: string;
}
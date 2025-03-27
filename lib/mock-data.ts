// Mock data for the hackathon judging application
// This will be replaced with actual database calls later

import { v4 as uuidv4 } from 'uuid';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'judge';
  status: 'active' | 'inactive' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'upcoming' | 'active' | 'completed';
  createdBy: string; // User ID
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  teamName: string;
  eventId: string; // Event ID
  createdAt: Date;
  updatedAt: Date;
}

export interface JudgingCriteria {
  id: string;
  name: string;
  description: string;
  maxScore: number;
  weight: number;
  eventId: string; // Event ID
  createdAt: Date;
  updatedAt: Date;
}

export interface Rating {
  id: string;
  score: number;
  comment: string;
  judgeId: string; // User ID
  projectId: string; // Project ID
  criteriaId: string; // JudgingCriteria ID
  eventId: string; // Event ID
  createdAt: Date;
  updatedAt: Date;
}

export interface EventParticipation {
  id: string;
  userId: string; // User ID
  eventId: string; // Event ID
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

// Mock data
const users: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    role: 'judge',
    status: 'active',
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-15'),
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'michael@example.com',
    role: 'judge',
    status: 'active',
    createdAt: new Date('2025-01-20'),
    updatedAt: new Date('2025-01-20'),
  },
  {
    id: '4',
    name: 'Emily Rodriguez',
    email: 'emily@example.com',
    role: 'admin',
    status: 'active',
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-10'),
  },
  {
    id: '5',
    name: 'David Kim',
    email: 'david@example.com',
    role: 'judge',
    status: 'inactive',
    createdAt: new Date('2025-01-25'),
    updatedAt: new Date('2025-02-05'),
  },
  {
    id: '6',
    name: 'Jessica Taylor',
    email: 'jessica@example.com',
    role: 'judge',
    status: 'active',
    createdAt: new Date('2025-02-01'),
    updatedAt: new Date('2025-02-01'),
  },
  {
    id: '7',
    name: 'Robert Johnson',
    email: 'robert@example.com',
    role: 'admin',
    status: 'active',
    createdAt: new Date('2025-01-05'),
    updatedAt: new Date('2025-01-05'),
  },
  {
    id: '8',
    name: 'Lisa Wang',
    email: 'lisa@example.com',
    role: 'judge',
    status: 'active',
    createdAt: new Date('2025-02-10'),
    updatedAt: new Date('2025-02-10'),
  },
];

const events: Event[] = [
  {
    id: '1',
    name: 'Summer Hackathon 2025',
    description: 'A two-day event focused on innovative solutions for climate change.',
    startDate: new Date('2025-06-15'),
    endDate: new Date('2025-06-16'),
    status: 'active',
    createdBy: '1',
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-15'),
  },
  {
    id: '2',
    name: 'AI Innovation Challenge',
    description: 'Exploring the frontiers of artificial intelligence and machine learning.',
    startDate: new Date('2025-05-05'),
    endDate: new Date('2025-05-06'),
    status: 'completed',
    createdBy: '1',
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-10'),
  },
  {
    id: '3',
    name: 'Web3 Developers Jam',
    description: 'Building the future of decentralized applications and blockchain technology.',
    startDate: new Date('2025-04-20'),
    endDate: new Date('2025-04-21'),
    status: 'completed',
    createdBy: '4',
    createdAt: new Date('2025-01-05'),
    updatedAt: new Date('2025-01-05'),
  },
  {
    id: '4',
    name: 'Mobile App Hackathon',
    description: 'Creating innovative mobile applications to solve everyday problems.',
    startDate: new Date('2025-03-10'),
    endDate: new Date('2025-03-11'),
    status: 'completed',
    createdBy: '7',
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2024-12-15'),
  },
  {
    id: '5',
    name: 'Health Tech Summit',
    description: 'Developing technology solutions for healthcare challenges.',
    startDate: new Date('2025-02-15'),
    endDate: new Date('2025-02-16'),
    status: 'completed',
    createdBy: '4',
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-01'),
  },
];

const projects: Project[] = [
  {
    id: '1',
    name: 'EcoTrack',
    description: 'A mobile app that helps users track and reduce their carbon footprint through daily activities.',
    teamName: 'Green Innovators',
    eventId: '1',
    createdAt: new Date('2025-06-01'),
    updatedAt: new Date('2025-06-01'),
  },
  {
    id: '2',
    name: 'MediConnect',
    description: 'A platform connecting patients with healthcare providers for remote consultations.',
    teamName: 'Health Tech Solutions',
    eventId: '1',
    createdAt: new Date('2025-06-02'),
    updatedAt: new Date('2025-06-02'),
  },
  {
    id: '3',
    name: 'SmartBudget',
    description: 'An AI-powered financial planning tool for personal budgeting.',
    teamName: 'FinTech Wizards',
    eventId: '1',
    createdAt: new Date('2025-06-03'),
    updatedAt: new Date('2025-06-03'),
  },
  {
    id: '4',
    name: 'VirtualAssistant',
    description: 'An advanced AI assistant for productivity and task management.',
    teamName: 'AI Pioneers',
    eventId: '2',
    createdAt: new Date('2025-05-01'),
    updatedAt: new Date('2025-05-01'),
  },
  {
    id: '5',
    name: 'DataViz',
    description: 'A data visualization tool for complex datasets.',
    teamName: 'Visualization Experts',
    eventId: '2',
    createdAt: new Date('2025-05-02'),
    updatedAt: new Date('2025-05-02'),
  },
  {
    id: '6',
    name: 'BlockChain Voting',
    description: 'A secure voting system built on blockchain technology.',
    teamName: 'Crypto Coders',
    eventId: '3',
    createdAt: new Date('2025-04-15'),
    updatedAt: new Date('2025-04-15'),
  },
];

const judgingCriteria: JudgingCriteria[] = [
  {
    id: '1',
    name: 'Innovation',
    description: 'How innovative is the solution?',
    maxScore: 10,
    weight: 1,
    eventId: '1',
    createdAt: new Date('2025-06-01'),
    updatedAt: new Date('2025-06-01'),
  },
  {
    id: '2',
    name: 'Technical Complexity',
    description: 'How technically complex is the implementation?',
    maxScore: 10,
    weight: 1,
    eventId: '1',
    createdAt: new Date('2025-06-01'),
    updatedAt: new Date('2025-06-01'),
  },
  {
    id: '3',
    name: 'Design',
    description: 'How well designed is the user interface and experience?',
    maxScore: 10,
    weight: 1,
    eventId: '1',
    createdAt: new Date('2025-06-01'),
    updatedAt: new Date('2025-06-01'),
  },
  {
    id: '4',
    name: 'Practicality',
    description: 'How practical and useful is the solution?',
    maxScore: 10,
    weight: 1,
    eventId: '1',
    createdAt: new Date('2025-06-01'),
    updatedAt: new Date('2025-06-01'),
  },
  {
    id: '5',
    name: 'Innovation',
    description: 'How innovative is the solution?',
    maxScore: 10,
    weight: 1,
    eventId: '2',
    createdAt: new Date('2025-05-01'),
    updatedAt: new Date('2025-05-01'),
  },
  {
    id: '6',
    name: 'Technical Implementation',
    description: 'Quality of technical implementation',
    maxScore: 10,
    weight: 1,
    eventId: '2',
    createdAt: new Date('2025-05-01'),
    updatedAt: new Date('2025-05-01'),
  },
];

const ratings: Rating[] = [
  {
    id: '1',
    score: 8.5,
    comment: 'Great concept with solid execution.',
    judgeId: '2',
    projectId: '1',
    criteriaId: '1',
    eventId: '1',
    createdAt: new Date('2025-06-15'),
    updatedAt: new Date('2025-06-15'),
  },
  {
    id: '2',
    score: 7.5,
    comment: 'Good technical implementation but could be more polished.',
    judgeId: '2',
    projectId: '1',
    criteriaId: '2',
    eventId: '1',
    createdAt: new Date('2025-06-15'),
    updatedAt: new Date('2025-06-15'),
  },
  {
    id: '3',
    score: 9.0,
    comment: 'Excellent user interface design.',
    judgeId: '2',
    projectId: '1',
    criteriaId: '3',
    eventId: '1',
    createdAt: new Date('2025-06-15'),
    updatedAt: new Date('2025-06-15'),
  },
  {
    id: '4',
    score: 8.0,
    comment: 'Very practical solution with real-world applications.',
    judgeId: '2',
    projectId: '1',
    criteriaId: '4',
    eventId: '1',
    createdAt: new Date('2025-06-15'),
    updatedAt: new Date('2025-06-15'),
  },
  {
    id: '5',
    score: 7.8,
    comment: 'Innovative approach to healthcare.',
    judgeId: '2',
    projectId: '2',
    criteriaId: '1',
    eventId: '1',
    createdAt: new Date('2025-06-15'),
    updatedAt: new Date('2025-06-15'),
  },
  {
    id: '6',
    score: 9.2,
    comment: 'Impressive financial algorithms.',
    judgeId: '2',
    projectId: '3',
    criteriaId: '1',
    eventId: '1',
    createdAt: new Date('2025-06-15'),
    updatedAt: new Date('2025-06-15'),
  },
  {
    id: '7',
    score: 8.7,
    comment: 'Cutting-edge AI implementation.',
    judgeId: '2',
    projectId: '4',
    criteriaId: '5',
    eventId: '2',
    createdAt: new Date('2025-05-05'),
    updatedAt: new Date('2025-05-05'),
  },
  {
    id: '8',
    score: 7.5,
    comment: 'Good visualization techniques.',
    judgeId: '2',
    projectId: '5',
    criteriaId: '5',
    eventId: '2',
    createdAt: new Date('2025-05-05'),
    updatedAt: new Date('2025-05-05'),
  },
];

const eventParticipations: EventParticipation[] = [
  {
    id: '1',
    userId: '2',
    eventId: '1',
    status: 'approved',
    createdAt: new Date('2025-06-01'),
    updatedAt: new Date('2025-06-02'),
  },
  {
    id: '2',
    userId: '3',
    eventId: '1',
    status: 'approved',
    createdAt: new Date('2025-06-01'),
    updatedAt: new Date('2025-06-02'),
  },
  {
    id: '3',
    userId: '6',
    eventId: '1',
    status: 'pending',
    createdAt: new Date('2025-06-10'),
    updatedAt: new Date('2025-06-10'),
  },
  {
    id: '4',
    userId: '8',
    eventId: '1',
    status: 'pending',
    createdAt: new Date('2025-06-11'),
    updatedAt: new Date('2025-06-11'),
  },
  {
    id: '5',
    userId: '2',
    eventId: '2',
    status: 'approved',
    createdAt: new Date('2025-05-01'),
    updatedAt: new Date('2025-05-02'),
  },
  {
    id: '6',
    userId: '3',
    eventId: '2',
    status: 'approved',
    createdAt: new Date('2025-05-01'),
    updatedAt: new Date('2025-05-02'),
  },
];

// Mock API functions
export const mockAPI = {
  // Users
  getUsers: () => Promise.resolve([...users]),
  getUserById: (id: string) => Promise.resolve(users.find(user => user.id === id) || null),
  createUser: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newUser: User = {
      ...userData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    users.push(newUser);
    return Promise.resolve(newUser);
  },
  updateUser: (id: string, userData: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>) => {
    const index = users.findIndex(user => user.id === id);
    if (index === -1) return Promise.resolve(null);
    
    users[index] = {
      ...users[index],
      ...userData,
      updatedAt: new Date(),
    };
    return Promise.resolve(users[index]);
  },
  deleteUser: (id: string) => {
    const index = users.findIndex(user => user.id === id);
    if (index === -1) return Promise.resolve(false);
    
    users.splice(index, 1);
    return Promise.resolve(true);
  },
  
  // Events
  getEvents: () => Promise.resolve([...events]),
  getEventById: (id: string) => Promise.resolve(events.find(event => event.id === id) || null),
  createEvent: (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEvent: Event = {
      ...eventData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    events.push(newEvent);
    return Promise.resolve(newEvent);
  },
  updateEvent: (id: string, eventData: Partial<Omit<Event, 'id' | 'createdAt' | 'updatedAt'>>) => {
    const index = events.findIndex(event => event.id === id);
    if (index === -1) return Promise.resolve(null);
    
    events[index] = {
      ...events[index],
      ...eventData,
      updatedAt: new Date(),
    };
    return Promise.resolve(events[index]);
  },
  deleteEvent: (id: string) => {
    const index = events.findIndex(event => event.id === id);
    if (index === -1) return Promise.resolve(false);
    
    events.splice(index, 1);
    return Promise.resolve(true);
  },
  
  // Projects
  getProjects: () => Promise.resolve([...projects]),
  getProjectsByEventId: (eventId: string) => Promise.resolve(projects.filter(project => project.eventId === eventId)),
  getProjectById: (id: string) => Promise.resolve(projects.find(project => project.id === id) || null),
  createProject: (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProject: Project = {
      ...projectData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    projects.push(newProject);
    return Promise.resolve(newProject);
  },
  updateProject: (id: string, projectData: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>) => {
    const index = projects.findIndex(project => project.id === id);
    if (index === -1) return Promise.resolve(null);
    
    projects[index] = {
      ...projects[index],
      ...projectData,
      updatedAt: new Date(),
    };
    return Promise.resolve(projects[index]);
  },
  deleteProject: (id: string) => {
    const index = projects.findIndex(project => project.id === id);
    if (index === -1) return Promise.resolve(false);
    
    projects.splice(index, 1);
    return Promise.resolve(true);
  },
  
  // Judging Criteria
  getCriteria: () => Promise.resolve([...judgingCriteria]),
  getCriteriaByEventId: (eventId: string) => Promise.resolve(judgingCriteria.filter(criteria => criteria.eventId === eventId)),
  getCriteriaById: (id: string) => Promise.resolve(judgingCriteria.find(criteria => criteria.id === id) || null),
  createCriteria: (criteriaData: Omit<JudgingCriteria, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCriteria: JudgingCriteria = {
      ...criteriaData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    judgingCriteria.push(newCriteria);
    return Promise.resolve(newCriteria);
  },
  updateCriteria: (id: string, criteriaData: Partial<Omit<JudgingCriteria, 'id' | 'createdAt' | 'updatedAt'>>) => {
    const index = judgingCriteria.findIndex(criteria => criteria.id === id);
    if (index === -1) return Promise.resolve(null);
    
    judgingCriteria[index] = {
      ...judgingCriteria[index],
      ...criteriaData,
      updatedAt: new Date(),
    };
    return Promise.resolve(judgingCriteria[index]);
  },
  deleteCriteria: (id: string) => {
    const index = judgingCriteria.findIndex(criteria => criteria.id === id);
    if (index === -1) return Promise.resolve(false);
    
    judgingCriteria.splice(index, 1);
    return Promise.resolve(true);
  },
  
  // Ratings
  getRatings: () => Promise.resolve([...ratings]),
  getRatingsByEventId: (eventId: string) => Promise.resolve(ratings.filter(rating => rating.eventId === eventId)),
  getRatingsByJudgeId: (judgeId: string) => Promise.resolve(ratings.filter(rating => rating.judgeId === judgeId)),
  getRatingsByProjectId: (projectId: string) => Promise.resolve(ratings.filter(rating => rating.projectId === projectId)),
  getRatingById: (id: string) => Promise.resolve(ratings.find(rating => rating.id === id) || null),
  createRating: (ratingData: Omit<Rating, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRating: Rating = {
      ...ratingData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    ratings.push(newRating);
    return Promise.resolve(newRating);
  },
  updateRating: (id: string, ratingData: Partial<Omit<Rating, 'id' | 'createdAt' | 'updatedAt'>>) => {
    const index = ratings.findIndex(rating => rating.id === id);
    if (index === -1) return Promise.resolve(null);
    
    ratings[index] = {
      ...ratings[index],
      ...ratingData,
      updatedAt: new Date(),
    };
    return Promise.resolve(ratings[index]);
  },
  deleteRating: (id: string) => {
    const index = ratings.findIndex(rating => rating.id === id);
    if (index === -1) return Promise.resolve(false);
    
    ratings.splice(index, 1);
    return Promise.resolve(true);
  },
  
  // Event Participation
  getEventParticipations: () => Promise.resolve([...eventParticipations]),
  getEventParticipationsByEventId: (eventId: string) => Promise.resolve(eventParticipations.filter(participation => participation.eventId === eventId)),
  getEventParticipationsByUserId: (userId: string) => Promise.resolve(eventParticipations.filter(participation => participation.userId === userId)),
  getEventParticipationById: (id: string) => Promise.resolve(eventParticipations.find(participation => participation.id === id) || null),
  createEventParticipation: (participationData: Omit<EventParticipation, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newParticipation: EventParticipation = {
      ...participationData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    eventParticipations.push(newParticipation);
    return Promise.resolve(newParticipation);
  },
  updateEventParticipation: (id: string, participationData: Partial<Omit<EventParticipation, 'id' | 'createdAt' | 'updatedAt'>>) => {
    const index = eventParticipations.findIndex(participation => participation.id === id);
    if (index === -1) return Promise.resolve(null);
    
    eventParticipations[index] = {
      ...eventParticipations[index],
      ...participationData,
      updatedAt: new Date(),
    };
    return Promise.resolve(eventParticipations[index]);
  },
  deleteEventParticipation: (id: string) => {
    const index = eventParticipations.findIndex(participation => participation.id === id);
    if (index === -1) return Promise.resolve(false);
    
    eventParticipations.splice(index, 1);
    return Promise.resolve(true);
  },
  
  // Helper functions
  getPendingApprovals: () => Promise.resolve(eventParticipations.filter(participation => participation.status === 'pending')),
  getEventStats: () => {
    const activeEvents = events.filter(event => event.status === 'active').length;
    const totalJudges = users.filter(user => user.role === 'judge').length;
    const projectsJudged = new Set(ratings.map(rating => rating.projectId)).size;
    const pendingApprovals = eventParticipations.filter(participation => participation.status === 'pending').length;
    
    return Promise.resolve({
      activeEvents,
      totalJudges,
      projectsJudged,
      pendingApprovals,
    });
  },
  getRecentEvents: (limit: number = 3) => {
    return Promise.resolve(
      [...events]
        .sort((a, b) => b.startDate.getTime() - a.startDate.getTime())
        .slice(0, limit)
        .map(event => {
          const judges = eventParticipations.filter(p => p.eventId === event.id && p.status === 'approved').length;
          const projectCount = projects.filter(p => p.eventId === event.id).length;
          return { ...event, judges, projects: projectCount };
        })
    );
  },
};
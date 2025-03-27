import { mockAPI } from '@/lib/mock-data';

describe('Mock API', () => {
  // Test user-related functions
  describe('User functions', () => {
    test('should create a user', async () => {
      const user = await mockAPI.createUser({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'judge',
      });
      
      expect(user).toHaveProperty('id');
      expect(user.name).toBe('Test User');
      expect(user.email).toBe('test@example.com');
      expect(user.role).toBe('judge');
      expect(user).not.toHaveProperty('password'); // Password should not be returned
    });
    
    test('should get a user by ID', async () => {
      // First create a user
      const createdUser = await mockAPI.createUser({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'judge',
      });
      
      // Then get the user by ID
      const user = await mockAPI.getUserById(createdUser.id);
      
      expect(user).toHaveProperty('id', createdUser.id);
      expect(user?.name).toBe('Test User');
      expect(user?.email).toBe('test@example.com');
    });
    
    test('should get a user by email', async () => {
      // First create a user
      const email = 'getuserbyemail@example.com';
      await mockAPI.createUser({
        name: 'Email Test',
        email,
        password: 'password123',
        role: 'judge',
      });
      
      // Then get the user by email
      const user = await mockAPI.getUserByEmail(email);
      
      expect(user).toHaveProperty('id');
      expect(user?.name).toBe('Email Test');
      expect(user?.email).toBe(email);
    });
    
    test('should authenticate a user with valid credentials', async () => {
      // First create a user
      const email = 'auth@example.com';
      const password = 'password123';
      await mockAPI.createUser({
        name: 'Auth Test',
        email,
        password,
        role: 'judge',
      });
      
      // Then authenticate
      const user = await mockAPI.authenticateUser(email, password);
      
      expect(user).toHaveProperty('id');
      expect(user?.name).toBe('Auth Test');
      expect(user?.email).toBe(email);
    });
    
    test('should not authenticate a user with invalid credentials', async () => {
      // First create a user
      const email = 'authfail@example.com';
      await mockAPI.createUser({
        name: 'Auth Fail Test',
        email,
        password: 'password123',
        role: 'judge',
      });
      
      // Then try to authenticate with wrong password
      const user = await mockAPI.authenticateUser(email, 'invalid');
      
      expect(user).toBeNull();
    });
  });
  
  // Test event-related functions
  describe('Event functions', () => {
    test('should create an event', async () => {
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      
      const event = await mockAPI.createEvent({
        name: 'Test Event',
        description: 'Test Description',
        status: 'upcoming',
        startDate,
        endDate,
        createdBy: 'test-user-id',
      });
      
      expect(event).toHaveProperty('id');
      expect(event.name).toBe('Test Event');
      expect(event.description).toBe('Test Description');
      expect(event.status).toBe('upcoming');
      expect(event.startDate).toEqual(startDate);
      expect(event.endDate).toEqual(endDate);
    });
    
    test('should get an event by ID', async () => {
      // First create an event
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      
      const createdEvent = await mockAPI.createEvent({
        name: 'Test Event',
        description: 'Test Description',
        status: 'upcoming',
        startDate,
        endDate,
        createdBy: 'test-user-id',
      });
      
      // Then get the event by ID
      const event = await mockAPI.getEventById(createdEvent.id);
      
      expect(event).toHaveProperty('id', createdEvent.id);
      expect(event?.name).toBe('Test Event');
    });
    
    test('should update an event', async () => {
      // First create an event
      const createdEvent = await mockAPI.createEvent({
        name: 'Update Event Test',
        description: 'Original Description',
        status: 'upcoming',
        startDate: new Date(),
        endDate: new Date(),
        createdBy: 'test-user-id',
      });
      
      // Then update the event
      const updatedEvent = await mockAPI.updateEvent(createdEvent.id, {
        name: 'Updated Event Name',
        description: 'Updated Description',
      });
      
      expect(updatedEvent).toHaveProperty('id', createdEvent.id);
      expect(updatedEvent.name).toBe('Updated Event Name');
      expect(updatedEvent.description).toBe('Updated Description');
      
      // Verify the update persisted
      const retrievedEvent = await mockAPI.getEventById(createdEvent.id);
      expect(retrievedEvent?.name).toBe('Updated Event Name');
    });
    
    test('should get all events', async () => {
      // Create a few events
      await mockAPI.createEvent({
        name: 'Event List Test 1',
        description: 'Description 1',
        status: 'upcoming',
        startDate: new Date(),
        endDate: new Date(),
        createdBy: 'test-user-id',
      });
      
      await mockAPI.createEvent({
        name: 'Event List Test 2',
        description: 'Description 2',
        status: 'active',
        startDate: new Date(),
        endDate: new Date(),
        createdBy: 'test-user-id',
      });
      
      // Get all events
      const events = await mockAPI.getEvents();
      
      // Check if our test events are in the list
      expect(events.some(e => e.name === 'Event List Test 1')).toBe(true);
      expect(events.some(e => e.name === 'Event List Test 2')).toBe(true);
    });
  });
  
  // Test project-related functions
  describe('Project functions', () => {
    let testEventId: string;
    
    beforeAll(async () => {
      // Create a test event to use for projects
      const event = await mockAPI.createEvent({
        name: 'Project Test Event',
        description: 'For project tests',
        status: 'active',
        startDate: new Date(),
        endDate: new Date(),
        createdBy: 'test-user-id',
      });
      
      testEventId = event.id;
    });
    
    test('should create a project', async () => {
      const project = await mockAPI.createProject({
        name: 'Test Project',
        description: 'Test Project Description',
        teamName: 'Test Team',
        eventId: testEventId,
      });
      
      expect(project).toHaveProperty('id');
      expect(project.name).toBe('Test Project');
      expect(project.description).toBe('Test Project Description');
      expect(project.teamName).toBe('Test Team');
      expect(project.eventId).toBe(testEventId);
    });
    
    test('should get projects by event ID', async () => {
      // Create a few projects for the test event
      await mockAPI.createProject({
        name: 'Event Project 1',
        description: 'Description 1',
        teamName: 'Team 1',
        eventId: testEventId,
      });
      
      await mockAPI.createProject({
        name: 'Event Project 2',
        description: 'Description 2',
        teamName: 'Team 2',
        eventId: testEventId,
      });
      
      // Get projects for the event
      const projects = await mockAPI.getProjectsByEventId(testEventId);
      
      // Check if our test projects are in the list
      expect(projects.some(p => p.name === 'Event Project 1')).toBe(true);
      expect(projects.some(p => p.name === 'Event Project 2')).toBe(true);
      
      // All projects should be for the test event
      expect(projects.every(p => p.eventId === testEventId)).toBe(true);
    });
  });
  
  // Test criteria-related functions
  describe('Criteria functions', () => {
    let testEventId: string;
    
    beforeAll(async () => {
      // Create a test event to use for criteria
      const event = await mockAPI.createEvent({
        name: 'Criteria Test Event',
        description: 'For criteria tests',
        status: 'active',
        startDate: new Date(),
        endDate: new Date(),
        createdBy: 'test-user-id',
      });
      
      testEventId = event.id;
    });
    
    test('should create criteria', async () => {
      const criteria = await mockAPI.createCriteria({
        name: 'Test Criteria',
        description: 'Test Criteria Description',
        maxScore: 10,
        weight: 0.3,
        eventId: testEventId,
      });
      
      expect(criteria).toHaveProperty('id');
      expect(criteria.name).toBe('Test Criteria');
      expect(criteria.description).toBe('Test Criteria Description');
      expect(criteria.maxScore).toBe(10);
      expect(criteria.weight).toBe(0.3);
      expect(criteria.eventId).toBe(testEventId);
    });
    
    test('should get criteria by event ID', async () => {
      // Create a few criteria for the test event
      await mockAPI.createCriteria({
        name: 'Event Criteria 1',
        description: 'Description 1',
        maxScore: 10,
        weight: 0.4,
        eventId: testEventId,
      });
      
      await mockAPI.createCriteria({
        name: 'Event Criteria 2',
        description: 'Description 2',
        maxScore: 5,
        weight: 0.6,
        eventId: testEventId,
      });
      
      // Get criteria for the event
      const criteriaList = await mockAPI.getCriteriaByEventId(testEventId);
      
      // Check if our test criteria are in the list
      expect(criteriaList.some(c => c.name === 'Event Criteria 1')).toBe(true);
      expect(criteriaList.some(c => c.name === 'Event Criteria 2')).toBe(true);
      
      // All criteria should be for the test event
      expect(criteriaList.every(c => c.eventId === testEventId)).toBe(true);
    });
  });
  
  // Test event participation functions
  describe('Event Participation functions', () => {
    let testEventId: string;
    let testUserId: string;
    
    beforeAll(async () => {
      // Create a test event
      const event = await mockAPI.createEvent({
        name: 'Participation Test Event',
        description: 'For participation tests',
        status: 'active',
        startDate: new Date(),
        endDate: new Date(),
        createdBy: 'test-user-id',
      });
      
      testEventId = event.id;
      
      // Create a test user
      const user = await mockAPI.createUser({
        name: 'Participation Test User',
        email: 'participation@example.com',
        password: 'password123',
        role: 'judge',
      });
      
      testUserId = user.id;
    });
    
    test('should create event participation', async () => {
      const participation = await mockAPI.createEventParticipation({
        userId: testUserId,
        eventId: testEventId,
        status: 'pending',
      });
      
      expect(participation).toHaveProperty('id');
      expect(participation.userId).toBe(testUserId);
      expect(participation.eventId).toBe(testEventId);
      expect(participation.status).toBe('pending');
    });
    
    test('should update event participation status', async () => {
      // First create a participation
      const participation = await mockAPI.createEventParticipation({
        userId: testUserId,
        eventId: testEventId,
        status: 'pending',
      });
      
      // Then update the status
      const updatedParticipation = await mockAPI.updateEventParticipation(participation.id, {
        status: 'approved',
      });
      
      expect(updatedParticipation).toHaveProperty('id', participation.id);
      expect(updatedParticipation.status).toBe('approved');
      
      // Verify the update persisted
      const participations = await mockAPI.getEventParticipationsByEventId(testEventId);
      const found = participations.find(p => p.id === participation.id);
      expect(found?.status).toBe('approved');
    });
    
    test('should get participations by event ID', async () => {
      // Create another user
      const anotherUser = await mockAPI.createUser({
        name: 'Another Participation User',
        email: 'another-participation@example.com',
        password: 'password123',
        role: 'judge',
      });
      
      // Create participations for both users
      await mockAPI.createEventParticipation({
        userId: testUserId,
        eventId: testEventId,
        status: 'approved',
      });
      
      await mockAPI.createEventParticipation({
        userId: anotherUser.id,
        eventId: testEventId,
        status: 'pending',
      });
      
      // Get participations for the event
      const participations = await mockAPI.getEventParticipationsByEventId(testEventId);
      
      // Check if our test participations are in the list
      expect(participations.some(p => p.userId === testUserId)).toBe(true);
      expect(participations.some(p => p.userId === anotherUser.id)).toBe(true);
      
      // All participations should be for the test event
      expect(participations.every(p => p.eventId === testEventId)).toBe(true);
    });
    
    test('should get pending approvals', async () => {
      // Create another event
      const anotherEvent = await mockAPI.createEvent({
        name: 'Another Participation Test Event',
        description: 'For pending approval tests',
        status: 'active',
        startDate: new Date(),
        endDate: new Date(),
        createdBy: 'test-user-id',
      });
      
      // Create a pending participation
      await mockAPI.createEventParticipation({
        userId: testUserId,
        eventId: anotherEvent.id,
        status: 'pending',
      });
      
      // Get pending approvals
      const pendingApprovals = await mockAPI.getPendingApprovals();
      
      // Check if our pending approval is in the list
      expect(pendingApprovals.some(p => p.status === 'pending' && p.eventId === anotherEvent.id)).toBe(true);
    });
  });
});
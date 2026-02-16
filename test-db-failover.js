/**
 * Database Failover Test Script
 * 
 * This script simulates a database failure and demonstrates the automatic failover mechanism.
 * It makes API calls to test both automatic and manual database switching.
 */

import fetch from 'node-fetch';

// Configuration
const BASE_URL = 'http://localhost:5000';
const AUTH = {
  username: 'admin',
  password: 'adminpassword'
};

// Store the authentication token
let authToken = null;

/**
 * Helper function to make authenticated fetch requests
 */
async function authenticatedFetch(url, options = {}) {
  // Authenticate first if we don't have a token
  if (!authToken) {
    console.log('Authenticating...');
    const authResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(AUTH)
    });
    
    if (!authResponse.ok) {
      throw new Error(`Authentication failed: ${authResponse.statusText}`);
    }
    
    const authData = await authResponse.json();
    authToken = authData.token;
    console.log('Authentication successful');
  }
  
  // Add the auth token to the request
  const headers = options.headers || {};
  headers['Authorization'] = `Bearer ${authToken}`;
  
  // Make the authenticated request
  return fetch(url, {
    ...options,
    headers
  });
}

/**
 * Check the current database health status
 */
async function checkDatabaseHealth() {
  console.log('\nChecking database health...');
  
  try {
    const response = await authenticatedFetch(`${BASE_URL}/api/admin/db-health`);
    
    if (!response.ok) {
      console.error(`Failed to check database health: ${response.statusText}`);
      return null;
    }
    
    const data = await response.json();
    console.log('Database health status:', data);
    return data;
  } catch (error) {
    console.error('Error checking database health:', error.message);
    return null;
  }
}

/**
 * Manually switch the database connection
 */
async function switchDatabase(target) {
  console.log(`\nSwitching database to ${target}...`);
  
  try {
    const response = await authenticatedFetch(`${BASE_URL}/api/admin/db-switch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target })
    });
    
    if (!response.ok) {
      console.error(`Failed to switch database: ${response.statusText}`);
      return null;
    }
    
    const data = await response.json();
    console.log('Database switch result:', data);
    return data;
  } catch (error) {
    console.error('Error switching database:', error.message);
    return null;
  }
}

/**
 * Run the test scenarios
 */
async function runTest() {
  console.log('Starting database failover test...\n');
  
  try {
    // Check initial database health
    await checkDatabaseHealth();
    
    // Test manual switch to PostgreSQL
    console.log('\n--- Testing manual switch to PostgreSQL ---');
    await switchDatabase('postgres');
    await checkDatabaseHealth();
    
    // Test manual switch back to Neon
    console.log('\n--- Testing manual switch back to Neon ---');
    await switchDatabase('neon');
    await checkDatabaseHealth();
    
    console.log('\nTest completed successfully!');
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// Run the test
runTest();
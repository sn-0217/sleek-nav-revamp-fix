

// This file will be replaced with actual API calls
export const loadApps = async () => {
  // Updated to match Spring Boot controller endpoint
  const response = await fetch('/api/get-apps');
  if (!response.ok) {
    throw new Error('Failed to load applications');
  }
  return response.json();
};

export const loadSubmissions = async () => {
  // Updated to match Spring Boot controller endpoint
  const response = await fetch('/api/get-all-submissions');
  if (!response.ok) {
    throw new Error('Failed to load submissions');
  }
  return response.json();
};

export const loadEnvironment = async () => {
  // This endpoint matches your controller
  const response = await fetch('/api/environment');
  if (!response.ok) {
    throw new Error('Failed to load environment');
  }
  return response.json();
};

export const createSubmission = async (submission: any) => {
  // Updated to match Spring Boot controller endpoint - using POST to /api/app/{appName}
  const response = await fetch(`/api/app/${encodeURIComponent(submission.appName)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(submission),
  });
  if (!response.ok) {
    throw new Error('Failed to create submission');
  }
  return response.json();
};


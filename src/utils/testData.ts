
// API calls for Spring Boot backend
export const loadApps = async () => {
  try {
    const response = await fetch('/api/get-apps');
    if (!response.ok) {
      throw new Error(`Failed to load applications: ${response.status}`);
    }
    const data = await response.json();
    console.log('Apps API response:', data);
    return data;
  } catch (error) {
    console.error('Error loading apps:', error);
    throw error;
  }
};

export const loadSubmissions = async () => {
  try {
    const response = await fetch('/api/get-all-submissions');
    if (!response.ok) {
      throw new Error(`Failed to load submissions: ${response.status}`);
    }
    const data = await response.json();
    console.log('Submissions API response:', data);
    return data;
  } catch (error) {
    console.error('Error loading submissions:', error);
    throw error;
  }
};

export const loadEnvironment = async () => {
  try {
    const response = await fetch('/api/environment');
    if (!response.ok) {
      throw new Error(`Failed to load environment: ${response.status}`);
    }
    const data = await response.json();
    console.log('Environment API response:', data);
    return data;
  } catch (error) {
    console.error('Error loading environment:', error);
    throw error;
  }
};

export const createSubmission = async (submission: any) => {
  try {
    const response = await fetch(`/api/app/${encodeURIComponent(submission.appName)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submission),
    });
    if (!response.ok) {
      throw new Error(`Failed to create submission: ${response.status}`);
    }
    const data = await response.text(); // Your controller returns a String
    console.log('Submission API response:', data);
    return data;
  } catch (error) {
    console.error('Error creating submission:', error);
    throw error;
  }
};

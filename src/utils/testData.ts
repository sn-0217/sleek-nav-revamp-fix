
export const generateTestData = () => {
  const testApps = [
    'Customer Portal',
    'Inventory Management',
    'Payment Gateway',
    'User Authentication',
    'Analytics Dashboard',
    'Email Service',
    'File Storage',
    'Notification Service',
    'Reporting Engine',
    'Backup Service'
  ];

  const testSubmissions = [
    {
      id: '1',
      appName: 'Customer Portal',
      changeNo: 'CHG-2024-001',
      approverName: 'John Smith',
      approverEmail: 'john.smith@company.com',
      decision: 'Approved',
      timestamp: '2024-06-10T14:30:00Z',
      comments: 'Security patches approved for immediate deployment.',
      environment: 'PROD'
    },
    {
      id: '2',
      appName: 'Inventory Management',
      changeNo: 'CHG-2024-002',
      approverName: 'Sarah Johnson',
      approverEmail: 'sarah.johnson@company.com',
      decision: 'Rejected',
      timestamp: '2024-06-09T09:15:00Z',
      comments: 'Requires additional testing before production deployment.',
      environment: 'PROD'
    },
    {
      id: '3',
      appName: 'Payment Gateway',
      changeNo: 'CHG-2024-003',
      approverName: 'Michael Chen',
      approverEmail: 'michael.chen@company.com',
      decision: 'Timed',
      timestamp: '2024-06-08T16:45:00Z',
      startTime: '2024-06-15T22:00:00Z',
      endTime: '2024-06-16T06:00:00Z',
      comments: 'Scheduled for weekend maintenance window.',
      environment: 'PROD'
    },
    {
      id: '4',
      appName: 'User Authentication',
      changeNo: 'CHG-2024-004',
      approverName: 'Emily Davis',
      approverEmail: 'emily.davis@company.com',
      decision: 'Approved',
      timestamp: '2024-06-07T11:20:00Z',
      comments: 'OAuth2 implementation approved.',
      environment: 'PROD'
    },
    {
      id: '5',
      appName: 'Analytics Dashboard',
      changeNo: 'CHG-2024-005',
      approverName: 'Robert Wilson',
      approverEmail: 'robert.wilson@company.com',
      decision: 'Timed',
      timestamp: '2024-06-06T13:10:00Z',
      startTime: '2024-06-20T20:00:00Z',
      endTime: '2024-06-21T04:00:00Z',
      comments: 'Performance optimization scheduled for low-traffic period.',
      environment: 'PROD'
    },
    {
      id: '6',
      appName: 'Email Service',
      changeNo: 'CHG-2024-006',
      approverName: 'Lisa Thompson',
      approverEmail: 'lisa.thompson@company.com',
      decision: 'Rejected',
      timestamp: '2024-06-05T08:30:00Z',
      comments: 'Configuration changes need security review.',
      environment: 'PROD'
    },
    {
      id: '7',
      appName: 'Customer Portal',
      changeNo: 'CHG-2024-007',
      approverName: 'David Brown',
      approverEmail: 'david.brown@company.com',
      decision: 'Approved',
      timestamp: '2024-06-04T15:45:00Z',
      comments: 'UI improvements approved for deployment.',
      environment: 'DEV'
    },
    {
      id: '8',
      appName: 'File Storage',
      changeNo: 'CHG-2024-008',
      approverName: 'Jennifer Garcia',
      approverEmail: 'jennifer.garcia@company.com',
      decision: 'Approved',
      timestamp: '2024-06-03T10:15:00Z',
      comments: 'Storage capacity increase approved.',
      environment: 'PROD'
    }
  ];

  // Store test data in localStorage
  localStorage.setItem('testApps', JSON.stringify(testApps));
  localStorage.setItem('changeSubmissions', JSON.stringify(testSubmissions));
  
  console.log('Test data loaded into localStorage');
  console.log('Test Apps:', testApps);
  console.log('Test Submissions:', testSubmissions);
  
  return { testApps, testSubmissions };
};

export const loadTestData = () => {
  const apps = JSON.parse(localStorage.getItem('testApps') || '[]');
  const submissions = JSON.parse(localStorage.getItem('changeSubmissions') || '[]');
  
  if (apps.length === 0 || submissions.length === 0) {
    return generateTestData();
  }
  
  return { testApps: apps, testSubmissions: submissions };
};

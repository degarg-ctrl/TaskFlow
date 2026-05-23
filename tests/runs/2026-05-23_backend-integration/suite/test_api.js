const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('Starting API integration tests...\n');
  let passCount = 0;
  let failCount = 0;

  const testEmail = `test_${Date.now()}@example.com`;
  const testPassword = 'Password123!';
  const testName = 'Test User';
  let token = '';
  let createdTaskId = '';

  const assert = (condition, message) => {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passCount++;
    } else {
      console.error(`[FAIL] ${message}`);
      failCount++;
    }
  };

  try {
    // 1. User Registration
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: testName, email: testEmail, password: testPassword })
    });
    const regData = await regRes.json();
    assert(regRes.status === 201, 'POST /auth/register returns 201 Status');
    assert(regData.data && regData.data.token, 'POST /auth/register returns valid token payload');
    assert(regData.data.user.email === testEmail, 'POST /auth/register returns correct email payload');

    // 2. User Login
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: testPassword })
    });
    const loginData = await loginRes.json();
    assert(loginRes.status === 200, 'POST /auth/login returns 200 Status');
    assert(loginData.data && loginData.data.token, 'POST /auth/login returns valid token payload');
    token = loginData.data.token;

    // 3. Auth Guard check without token
    const guardRes = await fetch(`${BASE_URL}/tasks`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const guardData = await guardRes.json();
    assert(guardRes.status === 401, 'GET /tasks without token returns 401 status');
    assert(guardData.error !== null, 'GET /tasks without token returns structured error envelope');

    // 4. Create Task
    const createTaskRes = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: 'Integration Test Task',
        note: 'Verifying backend features',
        priority: 'high'
      })
    });
    const createTaskData = await createTaskRes.json();
    assert(createTaskRes.status === 201, 'POST /tasks with token returns 201 status');
    assert(createTaskData.data && createTaskData.data.title === 'Integration Test Task', 'POST /tasks stores correct parameters');
    createdTaskId = createTaskData.data._id;

    // 5. Retrieve Tasks
    const fetchTasksRes = await fetch(`${BASE_URL}/tasks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    const fetchTasksData = await fetchTasksRes.json();
    assert(fetchTasksRes.status === 200, 'GET /tasks returns 200 status');
    assert(Array.isArray(fetchTasksData.data), 'GET /tasks yields task array payload');
    assert(fetchTasksData.data.some(task => task._id === createdTaskId), 'GET /tasks list contains newly created task');

    // 6. Update Task
    const updateTaskRes = await fetch(`${BASE_URL}/tasks/${createdTaskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status: 'done', priority: 'low' })
    });
    const updateTaskData = await updateTaskRes.json();
    assert(updateTaskRes.status === 200, 'PUT /tasks/:id returns 200 status');
    assert(updateTaskData.data && updateTaskData.data.status === 'done', 'PUT /tasks/:id status update persists');
    assert(updateTaskData.data && updateTaskData.data.priority === 'low', 'PUT /tasks/:id priority update persists');

    // 7. Delete Task
    const deleteTaskRes = await fetch(`${BASE_URL}/tasks/${createdTaskId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    assert(deleteTaskRes.status === 200, 'DELETE /tasks/:id returns 200 status');

    // 8. Confirm Delete
    const confirmDeleteRes = await fetch(`${BASE_URL}/tasks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    const confirmDeleteData = await confirmDeleteRes.json();
    assert(!confirmDeleteData.data.some(task => task._id === createdTaskId), 'Task is permanently deleted');

  } catch (error) {
    console.error('Test script crashed unexpectedly:', error);
    failCount++;
  }

  console.log(`\nTests finished. Pass: ${passCount}, Fail: ${failCount}`);
  process.exit(failCount > 0 ? 1 : 0);
}

runTests();

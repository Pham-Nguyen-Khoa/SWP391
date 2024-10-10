const request = require('supertest');
const sequelize = require('../config/database');
const { verifyEmail } = require('../helpers/checkMail');
const { sendMail } = require('../helpers/nodemailer');
const { generateRandomString } = require('../helpers/generate');
const app = require('../../index'); // Assuming your Express app is exported from index.js

// Test for Database Connection
test('Database connection should be successful', async () => {
    await expect(sequelize.authenticate()).resolves.not.toThrow();
});

// Test for Email Verification
test('Verify valid email', async () => {
    const result = await verifyEmail('test@example.com');
    expect(result).toBe(true);
});

// Test for User Registration
test('User registration should succeed with valid data', async () => {
    const response = await request(app)
        .post('/auth/register')
        .send({
            email: 'newuser@example.com',
            password: 'password123',
            fullName: 'New User'
        });
    expect(response.status).toBe(201);
});

// Test for User Login
test('User login should succeed with valid credentials', async () => {
    const response = await request(app)
        .post('/auth/login')
        .send({
            email: 'existinguser@example.com',
            password: 'password123'
        });
    expect(response.status).toBe(200);
});

// Test for Fetching Appointments
test('Fetch user appointments', async () => {
    const response = await request(app)
        .get('/koi/my-appointment')
        .set('Authorization', 'Bearer valid_token'); // Replace with a valid token
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
});

// Test for Sending Email
test('Send email should succeed', async () => {
    await expect(sendMail('test@example.com', 'Test Subject', '<h1>Test Email</h1>')).resolves.not.toThrow();
});

// Test for Creating a New Appointment
test('Create a new appointment', async () => {
    const response = await request(app)
        .post('/koi/appointment')
        .send({
            service: 'Health Check',
            date: '2023-10-10',
            customerID: 'customer123'
        });
    expect(response.status).toBe(201);
});

// Test for Updating Appointment Status
test('Update appointment status', async () => {
    const response = await request(app)
        .patch('/doctor/appointment/change-process/appointmentID/Accepted')
        .set('Authorization', 'Bearer valid_token'); // Replace with a valid token
    expect(response.status).toBe(200);
});

// Test for Validating Password
test('Password validation should fail for short password', () => {
    const req = { body: { password: '123', confirmPassword: '123' } };
    const res = { flash: jest.fn(), redirect: jest.fn() };
    const next = jest.fn();

    resetPassword(req, res, next);
    expect(res.flash).toHaveBeenCalledWith('error', 'Mật khẩu phải có độ dài lớn hơn 6 ký tự!');
    expect(res.redirect).toHaveBeenCalledWith('back');
});

// Test for Generating Random String
test('Generate random string of specified length', () => {
    const result = generateRandomString(10);
    expect(result).toHaveLength(10);
});
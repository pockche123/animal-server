const bcrypt = require('bcrypt');
const userController = require('../../../controller/UserController');
const User = require('../../../model/User');
const Token = require('../../../model/Token')

const mockSend = jest.fn();
const mockJson = jest.fn();
const mockStatus = jest.fn(code => ({ send: mockSend, json: mockJson }));
const mockRes = { status: mockStatus };

// Mock the User.create function

describe('user controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    it('is defined', () => {
        expect(userController).toBeDefined();
    });

    describe('register', () => {
        it('registers a new user successfully', async () => {
            // Mock request data
            const testUser = {
                id: 1,
                username: 'testuser',
                password: 'hashedPassword',
                is_admin: false
            }

            const mockReq = { body: testUser };

            // Mock bcrypt.genSalt and bcrypt.hash
            jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('mockedSalt');
            jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
            jest.spyOn(User, 'create').mockResolvedValue(new User(testUser));
            // Call the register function with the mocked req and res
            await userController.register(mockReq, mockRes);

               // Assertions
            expect(bcrypt.genSalt).toHaveBeenCalledWith(parseInt(process.env.BCRYPT_SALT_ROUNDS));
            expect(bcrypt.hash).toHaveBeenCalledWith('hashedPassword', 'mockedSalt');
            expect(User.create).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockSend).toHaveBeenCalledWith({...testUser});
        })

        it('handles registration error', async () => {
            let testUser = { name: 'user1' }
            const mockReq = { body: testUser }

            jest.spyOn(User, 'create')
                .mockRejectedValue(new Error('New User not made'))

            await userController.register(mockReq, mockRes)
            expect(User.create).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(400)
            expect(mockJson).toHaveBeenCalledWith({ error: 'New User not made' })
        });
    })

    describe('login', () => {
    it('logs in a user successfully', async () => {
        // Mock request data
        const testData = {
            username: 'testuser',
            password: 'password123',
        };

        // Mock user data
        const mockUser = {
            id: 1,
            username: 'testuser',
            password: 'hashedPassword',
        };

        // Mock req and res objects
        const mockReq = { body: testData };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Mock User.getByUsername and bcrypt.compare
        jest.spyOn(User, 'getByUsername').mockResolvedValue(mockUser);
        jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

        // Mock Token.create
        const mockToken = { user_id: 1, token: 'mockedToken' };
        jest.spyOn(Token, 'create').mockResolvedValue(mockToken);

        // Call the login function with the mocked req and res
        await userController.login(mockReq, mockRes);

        // Assertions
        expect(User.getByUsername).toHaveBeenCalledWith(testData.username);
        expect(bcrypt.compare).toHaveBeenCalledWith(testData.password, mockUser.password);
        expect(Token.create).toHaveBeenCalledWith(mockUser.id);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ authenticated: true, token: mockToken.token });
    });

    it('handles incorrect credentials', async () => {
        // Mock request data
        const testData = {
            username: 'testuser',
            password: 'wrongPassword',
        };

        // Mock user data
        const mockUser = {
            id: 1,
            username: 'testuser',
            password: 'hashedPassword',
        };

        // Mock req and res objects
        const mockReq = { body: testData };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Mock User.getByUsername and bcrypt.compare
        jest.spyOn(User, 'getByUsername').mockResolvedValue(mockUser);
        jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

        // Call the login function with the mocked req and res
        await userController.login(mockReq, mockRes);

        // Assertions
        expect(User.getByUsername).toHaveBeenCalledWith(testData.username);
        expect(bcrypt.compare).toHaveBeenCalledWith(testData.password, mockUser.password);
        expect(mockRes.status).toHaveBeenCalledWith(403);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Incorrect credentials' });
    });

    it('handles login error', async () => {
        // Mock request data
        const testData = {
            username: 'testuser',
            password: 'password123',
        };

        // Mock req and res objects
        const mockReq = { body: testData };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Mock User.getByUsername throwing an error
        jest.spyOn(User, 'getByUsername').mockRejectedValue(new Error('User not found'));

        // Call the login function with the mocked req and res
        await userController.login(mockReq, mockRes);

        // Assertions
        expect(User.getByUsername).toHaveBeenCalledWith(testData.username);
        expect(mockRes.status).toHaveBeenCalledWith(403);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'User not found' });
    });
});

})

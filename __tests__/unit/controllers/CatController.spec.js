const catController = require('../../../controller/CatController')
const Cat = require('../../../model/Cat')


const mockSend = jest.fn()
const mockJson = jest.fn()
const mockEnd = jest.fn()
// we are mocking .send(), .json() and .end()
const mockStatus = jest.fn(code => ({ send: mockSend, json: mockJson, end: mockEnd }))
const mockRes = { status: mockStatus }


describe('cats controller', () => {
    beforeEach(() => jest.clearAllMocks())

    afterAll(() => jest.resetAllMocks())

    it('is defined', () => {
        expect(catController).toBeDefined()
    })

    describe('index', () => {
        it('should return cats with a status code 200', async () => {
            const testCats = ['cat1', 'cat2']
            jest.spyOn(Cat, 'getAll')
                .mockResolvedValue(testCats)
            await catController.index(null, mockRes)
            expect(Cat.getAll).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(200)
            expect(mockJson).toHaveBeenCalledWith(testCats)

        })

        it('sends an error when failing to return cats', async () => {
            jest.spyOn(Cat, 'getAll')
                .mockRejectedValue(new Error('Something happened to your db'))

            await catController.index(null, mockRes)
            expect(Cat.getAll).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(500)
            expect(mockJson).toHaveBeenCalledWith({ error: 'Something happened to your db' })
        })
    })

    describe('show', () => {
        let testCat, mockReq
        beforeEach(() => {
            testCat = { id: 1, name: "one", type: "mock", description: "mock", habitat: "mock" }
            mockReq = { params: { id: 1 } }

        })

        it('return a cat with a 200 status code', async () => {
            jest.spyOn(Cat, 'findById')
                .mockResolvedValue(new Cat(testCat))

            await catController.show(mockReq, mockRes)
            expect(Cat.findById).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(200)
            expect(mockSend).toHaveBeenCalledWith({ catData: new Cat(testCat) })
        })

        it('sends an error upon fail', async () => {
            jest.spyOn(Cat, 'findById')
                .mockRejectedValue(new Error('Cat not found'))

            await catController.show(mockReq, mockRes)
            expect(Cat.findById).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(404)
            expect(mockSend).toHaveBeenCalledWith({ error: 'Cat not found' })
        })
    })


    describe('create Cat in controller', () => {
        test('returns a new cat with a 201 status code', async () => {
            let testCat = { name: "one", type: "mock", description: "mock", habitat: "mock" }
            const mockReq = { body: testCat }

            jest.spyOn(Cat, 'create')
                .mockResolvedValue(new Cat(testCat))

            await catController.create(mockReq, mockRes)
            expect(Cat.create).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(201)
            expect(mockSend).toHaveBeenCalledWith({ data: new Cat({ ...testCat }) });


        })

        test('returns an error with incomplete info', async () => {
            let testCat = { name: 'cat' }
            const mockReq = { body: testCat }

            jest.spyOn(Cat, 'create')
                .mockRejectedValue(new Error('New Cat not made'))

            await catController.create(mockReq, mockRes)
            expect(Cat.create).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(400)
            expect(mockSend).toHaveBeenCalledWith({ error: 'New Cat not made' })
        })

        describe('update', () => {
            test('modifies a row in the database', async () => {
                let testCat = { id: 1, name: "one", type: "mock", description: "mock", habitat: "mock" }
                jest.spyOn(Cat, 'findById')
                    .mockResolvedValue(new Cat(testCat))
                const mockReq = { params: { id: 1 }, body: { name: "coolcat", habitat: "chilled place" } }

                jest.spyOn(Cat.prototype, 'update')
                    .mockResolvedValue({ ...new Cat(testCat), name: 'coolcat', habitat: "chilled place" })

                await catController.update(mockReq, mockRes)

                expect(Cat.findById).toHaveBeenCalledTimes(1)
                expect(Cat.prototype.update).toHaveBeenCalledTimes(1)
                expect(mockStatus).toHaveBeenCalledWith(200)
                expect(mockJson).toHaveBeenCalledWith(new Cat({ id: 1, name: "coolcat", type: "mock", description: "mock", habitat: "chilled place" }))

            })

            test('returns 400 when the update fails', async () => {
                // Arrange
                const testCat = { id: 1, name: "one", type: "mock", description: "mock", habitat: "mock" };

                jest.spyOn(Cat, 'findById')
                    .mockResolvedValue(new Cat(testCat));

                const mockReq = { params: { id: 1 }, body: { name: "coolcat", habitat: "chilled place" } };

                jest.spyOn(Cat.prototype, 'update')
                    .mockRejectedValue(new Error('Update failed')); // Simulate an update failure

                // Act
                await catController.update(mockReq, mockRes);

                // Assert
                expect(Cat.findById).toHaveBeenCalledWith(1);
                expect(Cat.prototype.update).toHaveBeenCalledWith({
                    id: 1,
                    name: 'coolcat',
                    type: 'mock',
                    description: 'mock',
                    habitat: 'chilled place',
                });
                expect(mockStatus).toHaveBeenCalledWith(400);
                expect(mockSend).toHaveBeenCalledWith({ error: 'Update failed' });
            });



        })


    })

    describe('destroy Cat controller', () => {
        test('returns a 204 status code on successful deletion', async () => {
            const testCat = { id: 1, name: "one", type: "mock", description: "mock", habitat: "mock" };
            jest.spyOn(Cat, 'findById')
                .mockResolvedValue(new Cat(testCat))
            
            jest.spyOn(Cat.prototype, 'delete')
                .mockResolvedValue(new Cat(testCat))
            
            const mockReq = { params: { id: 1 } }
            await catController.destroy(mockReq, mockRes)

            expect(Cat.findById).toHaveBeenCalledTimes(1)
            expect(Cat.prototype.delete).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(204)
            expect(mockEnd).toHaveBeenCalledWith()

        })

        test('return 404 error for cat to be destoyed', async () => {
            const mockReq = { params: { id: 42 } }
            jest.spyOn(Cat, 'findById')
                .mockRejectedValue(new Error('cat not found'))
            
            await catController.destroy(mockReq, mockRes)
            expect(mockStatus).toHaveBeenCalledWith(404)
            expect(mockSend).toHaveBeenCalledWith({error: 'cat not found'})
        })
    })




})
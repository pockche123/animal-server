const Cat = require('../../../model/Cat')
const db = require('../../../database/connect')

// arrange
 const mockData = {
        rows: [
          { name: "one", type: "mock", description: "mock", habitat: "mock" },
          { name: "two ", type: "mock", description: "mock", habitat: "mock" },
          { name: "three", type: "mock", description: "mock", habitat: "mock" }
        ]
      };

describe('Cat', () => {
    beforeEach(() => jest.clearAllMocks())
    afterAll(() => jest.resetAllMocks())

    it('is defined', () => {
        expect(Cat).toBeDefined()
    })

    describe('getAll', () => {
        it('resolves with cats on successful', async () => {
            //act
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce(mockData)
            const cats = await Cat.getAll()
            //assert
            expect(cats).toHaveLength(3)
            //verify
            expect(cats[0]).toHaveProperty('id')
        })
    })
})
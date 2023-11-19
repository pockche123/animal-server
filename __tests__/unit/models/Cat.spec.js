const Cat = require("../../../model/Cat");
const db = require("../../../database/connect");

// arrange
let mockData;

describe("Cat", () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockData = {
            rows: [
                { id: 1, name: "one", type: "mock", description: "mock", habitat: "mock" },
                { id: 2, name: "two ", type: "mock", description: "mock", habitat: "mock" },
                { id: 3, name: "three", type: "mock", description: "mock", habitat: "mock" },
            ],
        };
    
    } );
    afterAll(() => jest.resetAllMocks());

    it("is defined", () => {
        expect(Cat).toBeDefined();
    });

    describe("getAll", () => {
        it("resolves with cats on successful", async () => {
            //act
            jest.spyOn(db, "query").mockResolvedValueOnce(mockData);
            const cats = await Cat.getAll();
            //assert
            expect(cats).toHaveLength(3);
            //verify
            expect(cats[0]).toHaveProperty("id");
        });
    });

    describe("Cat.findById", () => {
        it("resolves with cat on successful db query", async () => {
            // act
            jest
                .spyOn(db, "query")
                .mockResolvedValueOnce({ rows: [mockData.rows[0]] });
            // assert
            const result = await Cat.findById(1);
            expect(result.id).toBe(1);
            expect(result).toBeInstanceOf(Cat);
            expect(result.name).toBe("one");
        });

        it("rejects with an error when cat is not found in the db", async () => {
            // Arrange
            jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [] });

            // Act and Assert
            await expect(Cat.findById(1)).rejects.toThrow("Unable to locate cat");

            // Ensure that the query function was called with the correct parameters
            expect(db.query).toHaveBeenCalledWith(
                "SELECT * FROM cats WHERE id = $1",
                [1]
            );
        });
    });

    describe("Cat.create", () => {
        it("resolves with cat on successful create db query", async () => {
            // arrange
            jest.spyOn(db, "query").mockResolvedValueOnce(mockData);
            // Act
            const newCat = {
                name: "newCat",
                type: "Domestic",
                description: "A cute cat",
                habitat: "Indoor",
            };
            const result = await Cat.create(newCat);
            // assert
            expect(result).toBeTruthy();
            expect(result).toBeInstanceOf(Cat);
            expect(result.id).toBe(1);
            expect(db.query).toHaveBeenCalledWith(
                "INSERT INTO cats (name, type, description, habitat) VALUES ($1, $2, $3, $4) RETURNING *;",
                [newCat.name, newCat.type, newCat.description, newCat.habitat]
            );
        });
    });

    describe("update", () => {
        it("modifies a row in the cats database successfully", async () => {
            // arrange
            jest.spyOn(Cat, "findById").mockResolvedValueOnce({ rows: mockData.rows[1]});

            const updatedData = {
                id: 2,
                name: "updatedCat",
                type: "Wild",
                description: "Updated cat",
                habitat: "Outdoor",
            };

            jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [updatedData] });

            const cat = new Cat(mockData.rows[1]);
            const result = await cat.update(updatedData);
            expect(result.id).toBe(2);
            expect(result.name).toBe("updatedCat");
            expect(result.type).toBe("Wild");
            expect(result.description).toBe("Updated cat");
            expect(result.habitat).toBe("Outdoor");
        });

        it("fails to modify a row in the cats database when an error occurs in the query", async () => {
            // arrange
            jest.spyOn(Cat, "findById").mockResolvedValueOnce(mockData.rows[1]);

            const updatedData = {
                id: 2,
                name: "updatedCat",
                type: "Wild",
                description: "Updated cat",
                habitat: "Outdoor",
            };

            // Simulate an error in the query
            jest
                .spyOn(db, "query")
                .mockRejectedValueOnce(new Error("Database query error"));

            // Act and assert
            await expect(async () => {
                const cat = new Cat(updatedData);
                await cat.update(updatedData);
            }).rejects.toThrow("Database query error");
        });
        it("fails to modify a row in the cats database when the cat is not found", async () => {
            // arrange
            // Mock Cat.findById to return null, indicating that the cat is not found
            jest.spyOn(Cat, "findById").mockResolvedValueOnce(null);

            const updatedData = {
                id: 2,
                name: "updatedCat",
                type: "Wild",
                description: "Updated cat",
                habitat: "Outdoor",
            };

            // Act and assert
            await expect(async () => {
                const cat = new Cat(updatedData);
                await cat.update(updatedData);
            }).rejects.toThrow("Cat not found");
        });
    })

    describe('Cat deletion', () => {
        it('deletes a cat successfully', async () => {
            // Arrange
            const mockDbQuery = jest.fn().mockResolvedValueOnce({ rows: [{ id: 1 }] });
            jest.spyOn(db, 'query').mockImplementation(mockDbQuery);

            const cat = new Cat({ id: 1 });

            // Act
            const result = await cat.delete();

            // Assert
            expect(result).toBe('Cat was deleted');
            expect(mockDbQuery).toHaveBeenCalledWith("SELECT * FROM cats WHERE id = $1", [1]);
            expect(mockDbQuery).toHaveBeenCalledWith("DELETE FROM cats WHERE id = $1 RETURNING *;", [1]);
        });

        it('fails to delete a cat when the cat is not found', async () => {
            // Arrange
            const cat = new Cat({ id: 2 });

            // Act
            const deletionPromise = cat.delete();

            // Assert
            await expect(deletionPromise).rejects.toThrow('Cat not found');
        });
    })


});

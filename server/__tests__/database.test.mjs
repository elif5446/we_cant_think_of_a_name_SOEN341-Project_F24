import Database from "../database/database.mjs"

test("------ CONNECTION TEST ------", async () => {
    const database = new Database()
    try{
        await database.connect()
    } catch(e) {
        fail("Database connection unsuccesful.")
    }  finally {
        expect(true).toBe(true)
        database.close()
    }
})

test("------ CREATION/RETRIEVAL TEST ------", async () => {
    const database = new Database()
    try{
        await database.connect()
        // await database.createUser("testemail@xyz.com", "Test", "User", "testpassword", "instructor")
        const returnUser = await database.getUser("testemail@xyz.com", "testpassword")
        const badUser = await database.getUser("testemail@xyz.com", "wrongpassword")
        expect(returnUser.result).toBe("success")
        expect(badUser.result).toBe("fail")
        expect(returnUser.user.firstname).toBe("Test")
        expect(badUser.user).toBe(null)
    } finally {
        database.close()
    }
}, 10000)

// create test + get test

/////// next file

// api fetch tests

// api error code tests

/////// next file

// selenium tests

/////// github ci

// full pipeline
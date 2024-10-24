import Database from "../database/database.mjs"

test("------ CONNECTION TEST ------", async () => {
    try{
        const database = new Database()
        await database.connect()
    } catch(e) {
        fail("Database connection unsuccesful.")
    }  finally {
        expect(true).toBe(true)
    }
})

// create test + get test

/////// next file

// api tests

// api error code tests

/////// next file

// fetch tests

/////// next file

// selenium tests

/////// github ci

// full pipeline
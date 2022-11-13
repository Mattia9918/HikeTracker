"use strict";

const dao = require('../dao');

describe("test user", () => {

    beforeEach(async () => {
        await dao.deleteUser();
    })

    testInsertUserOk();
    testInsertUserErr();
});

function testInsertUserOk() {
    const user = {
        name: "Mario",
        surname: "Rossi",
        username: "mariorossi1",
        email: "mario.rossi@mail.it",
        password: "password",
        salt: "salt",
        role: "role"
    }

    test("Insert user OK", async () => {
        let id = await dao.insertUser(
            user.email,
            user.password,
            user.salt,
            user.role,
            user.name,
            user.surname,
            user.username
        );
        let result = await dao.getUserById(id)

        expect(result.email).toEqual(user.email);
        expect(result.hash).toEqual(user.password);
        expect(result.salt).toEqual(user.salt);
        expect(result.role).toEqual(user.role);
        expect(result.name).toEqual(user.name);
        expect(result.surname).toEqual(user.surname);
        expect(result.username).toEqual(user.username);
        expect(result.isActive).toEqual(0);
    })
}
/*
function testInsertUserErr() {
    const user = {
        name: "Mario",
        surname: "Rossi",
        username: "mariorossi1",
        email: "mario.rossi@mail.it",
        password: "password",
        salt: "salt",
        role: "role"
    }

    test("Insert user Err", async () => {
        await dao.insertUser(
            user.email,
            user.password,
            user.salt,
            user.role,
            user.name,
            user.surname,
            user.username
        );

        expect(await dao.insertUser(
            user.email,
            user.password,
            user.salt,
            user.role,
            user.name,
            user.surname,
            user.username
        )).toThrowError(SQLITE_CONSTRAINT)
    })
}
 */


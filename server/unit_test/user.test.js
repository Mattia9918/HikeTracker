"use strict";

const dao = require('../modules/dao/userdao.js');
const bcrypt = require("bcrypt");

describe("test user", () => {

    beforeEach(async () => {
        await dao.deleteUser();
    })

    testUserOk();
});

function testUserOk() {
    const user = {
        name: "Mario",
        surname: "Rossi",
        username: "mariorossi1",
        email: "mario.rossi@mail.it",
        password: "password",
        role: "role"
    }

    test("Insert user OK", async () => {

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);

        let id = await dao.insertUser(
            user.email,
            hash,
            salt,
            user.role,
            user.name,
            user.surname,
            user.username
        );

        let result = await dao.getUserById(id)

        expect(result.email).toEqual(user.email);
        expect(result.hash).toEqual(hash);
        expect(result.salt).toEqual(salt);
        expect(result.role).toEqual(user.role);
        expect(result.name).toEqual(user.name);
        expect(result.surname).toEqual(user.surname);
        expect(result.username).toEqual(user.username);
        expect(result.isActive).toEqual(0);

        let result2 = await dao.getUserByEmail(user.email)
        expect(result2).toEqual(result)

        let result3 = await dao.getUserByUsername(user.username)
        expect(result3).toEqual(result)

        await dao.activateUser(user.email)
        let activeUser = await dao.getUserByEmail(user.email)
        expect(activeUser.isActive).toEqual(1)

        let login = await dao.getUserByCredentials(user.email, user.password)
        expect(login).toEqual(activeUser)

        let wrongCred = await dao.getUserByCredentials(user.email, "sbagliata")
        expect(wrongCred).toBeFalsy()
    })
}

describe("test activation", () => {

    beforeEach(async () => {
        await dao.deleteTableActivation();
    })

    testActivationOk();
});

function testActivationOk() {
    const activation = {
        email: "mario.rossi@gmail.com",
        code: "code"
    }

    test("Insert activation OK", async () => {
        let code = await dao.insertActivation(
            activation.email,
            activation.code
        );
        let result = await dao.getActivationByCode(code)

        expect(result.email).toEqual(activation.email);
        expect(result.code).toEqual(activation.code);

        await dao.deleteActivation(activation.email)
        let undef = await dao.getActivationByCode(activation.code)
        expect(undef).toBeUndefined()
    })
}


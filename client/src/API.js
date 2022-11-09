
const APIURL = 'http://localhost:3001/api/'

async function addUser(user) {

    const url = APIURL + `register`;

    try {

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                email: user.email,
                password: user.password,
                role:user.role,
                name: user.name,
                surname: user.surname
            })
        });
        if (response.ok) {
            return true;
        } else {
            /* Application error */
            const appErrText = await response.text();

            throw new TypeError(appErrText);

        }
    } catch (error) {
        /* Network error */

        throw (error);
    }
}

async function validateUser(code) {

    const url = APIURL + `validate/`+code;

    try {

        const response = await fetch(url);
        if (response.ok) {
            return true;
        } else {
            /* Application error */
            const appErrText = await response.text();

            throw new TypeError(appErrText);

        }
    } catch (error) {
        /* Network error */

        throw (error);
    }
}




const API = { addUser,validateUser };
export default API;
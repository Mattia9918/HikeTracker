
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
                surname: user.surname,
                username: user.username
            })
        });
        if (response.ok) {
            return true;
        } else {
          
            const appErrText = await response.text();

            throw new TypeError(appErrText);
           

        }
    } catch (error) {
        console.log(error);
        throw error; 
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
        console.log(error);
        throw (error);
    }
}


// /api/sessions
async function logIn(credentials) { 
    try{
        
    let response = await fetch(new URL("sessions",APIURL), {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      if(response.ok) {
          const user = await response.json();
          return user;
      }
      else {
          const errDetail = await response.json();
          
          throw errDetail;
      }
    }
    catch(error){ 
        console.log(error);
        throw error;
    }
}
  
// /api/sessions/current
async function logOut() {
    await fetch(new URL('sessions/current',APIURL), 
              { method: 'DELETE',credentials:'include' });
}

async function getUserInfo() {
    const response = await fetch(new URL('sessions/current', APIURL),
            {credentials: 'include'});
    const userInfo = await response.json();
    
    if (response.ok) {
      return userInfo;
    } else {
      throw userInfo; 
    }
  }

  






const APILogin = {  addUser,  validateUser,  logIn,logOut,getUserInfo};
export default APILogin;

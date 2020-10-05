import React, { useState } from 'react';
import loginService from '../services/login'



const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);

    const handleLogin = async (event) => {
        event.preventDefault();
        
        try {
            const user = await loginService.login({
                username,
                password
            })

            
            setUser(user);
            console.log(user);
            setPassword('');
            setUsername('');
        }
        catch(exception) {
            console.log('Wrong Credentials');
        }
    }

    const loginForm = () => (
        <>
        <h2>Log in to Application</h2>
        <form onSubmit = {handleLogin}>
                <div>
                    username 
                    <input 
                        type = "text"
                        value = {username}
                        name = "Username"
                        onChange = {(event) => setUsername(event.target.value)}
                    />
    
                </div>
                <div>
                    password
                    <input 
                        type = "password"
                        value = {password}
                        name = "Password"
                        onChange = {(event) => setPassword(event.target.value)}
                    />
    
                </div>
                <button type="submit">login</button>
            </form>
            </>
    )

    return(
        <>
        {user === null
             ? loginForm() 
             : <p>{user.name} logged in </p>       
        }

        </>
    )

}

export default Login;
import { useState } from "react";
import secureLocalStorage from 'react-secure-storage'

export default function LoginPage() {
    const [ username, setUsername ] = useState("")
    const [ password, setPassword ] = useState("")

    function handleSubmit(e) {
        e.preventDefault()
        fetch('https://clockworks.fly.dev/auth/login', {
            method: "POST",
            mode: "cors",
            body: JSON.stringify({
                Username: username,
                Password: password
            })
      }).then(async (response) => {
            let jsonResponse = await response.json();
            secureLocalStorage.setItem("token", jsonResponse.token);
            secureLocalStorage.setItem("username", username);
            console.log(jsonResponse.message);
            console.log(secureLocalStorage.getItem("token"));
            alert(jsonResponse.message);

            if (jsonResponse.message == "Login successful.") {
                window.location.href = '/';
            }
        });
    }

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text"
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}>
                </input><br/>
                <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}>
                </input><br/>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}
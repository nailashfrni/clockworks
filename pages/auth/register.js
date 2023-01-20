import { useState } from "react";

export default function RegisterPage() {
    const [ email, setEmail ] = useState("")
    const [ username, setUsername ] = useState("")
    const [ password, setPassword ] = useState("")

    function handleSubmit(e) {
        e.preventDefault()
        fetch('https://clockworks.fly.dev/auth/register', {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({
          Email: email,
          Username: username,
          Password: password
        })
      }).then(async (response) => {
        let jsonResponse = await response.json();
        console.log(jsonResponse);
        alert(jsonResponse.message);
        if (jsonResponse.message == "Succesfully registered user.") {
            window.location.href = '/auth/login';
        }
      });
    }

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <input 
                    type="email"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}>
                </input><br/>
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
                <button type="submit">Register</button>
            </form>
        </div>
    )
}
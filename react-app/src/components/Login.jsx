import Header from "./Header";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import API_URL from "../constants";
import "./Login.css"; // Import your CSS file

function Login() {
    const navigate = useNavigate();
    const [username, setusername] = useState("");
    const [password, setpassword] = useState("");

    const handleApi = () => {
        const url = API_URL + "/login";
        const data = { username, password };
        axios.post(url, data)
            .then((res) => {
                if (res.data.message) {
                    if (res.data.token) {
                        localStorage.setItem('token', res.data.token);
                        localStorage.setItem('userId', res.data.userId);
                        localStorage.setItem('userName', res.data.username);
                        navigate('/');
                    }
                }
            })
            .catch((err) => {
                alert("SERVER ERR");
            });
    };

    return (
        <div>
            <Header />
            <div className="login-container">
                <div className="login-form">
                    <h3>Welcome to Login</h3>
                    <input className="form-control" type="text" placeholder="Username" value={username} onChange={(e) => setusername(e.target.value)} />
                    <input className="form-control" type="password" placeholder="Password" value={password} onChange={(e) => setpassword(e.target.value)} />
                    <button className="btn btn-primary" onClick={handleApi}>LOGIN</button>
                    <Link className="signup-link" to="/signup">SIGNUP</Link>

                    <Link className="admin" to="/admin-login">Admin Login</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;

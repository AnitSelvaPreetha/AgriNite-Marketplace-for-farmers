import Header from "./Header";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import API_URL from "../constants";
import "./Signup.css"; // Import your CSS file

function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');

    const handleApi = () => {
        const url = API_URL + '/signup';
        const data = { username, password, mobile, email };
        axios.post(url, data)
            .then((res) => {
                if (res.data.message) {
                    alert(res.data.message);
                }
            })
            .catch((err) => {
                alert('SERVER ERR');
            });
    };

    return (
        <div>
            <Header />
            <div className="signup-container">
                <div className="signup-form">
                    <h3>Welcome to Signup</h3>
                    <input className="form-control" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <input className="form-control" type="text" placeholder="Mobile No" value={mobile} onChange={(e) => setMobile(e.target.value)} />
                    <input className="form-control" type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input className="form-control" type="text" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button className="btn btn-primary" onClick={handleApi}>SIGNUP</button>
                    <Link className="login-link" to="/login">LOGIN</Link>
                </div>
            </div>
        </div>
    );
}

export default Signup;

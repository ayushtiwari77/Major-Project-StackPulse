import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "../config/axios";
import { useNavigate } from "react-router-dom";
import { UseUser } from "../context/MainContext";

const Login = () => {
  const { setUser } = UseUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  //function to handle login

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await axios.post("/user/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);

      return navigate("/");
    } catch (err) {
      setEmail("");
      setPassword("");
      console.log(err.response.data);
    }
  }

  return (
    <div className="min-h-screen flex  items-center justify-center bg-gray-900">
      <div className="bg-gray-800 flex flex-col gap-7 items-center p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6">Login</h2>
        <form
          onSubmit={handleSubmit}
          className="flex  w-3/4 text-lg flex-col  items-center"
        >
          <div className="mb-6 w-full  ">
            <label className="block text-gray-400 mb-2" htmlFor="email">
              Email
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              id="email"
              className="w-full indent-2.5 p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              value={email}
            />
          </div>
          <div className="mb-6 w-full">
            <label className="block text-gray-400 mb-2" htmlFor="password">
              Password
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              id="password"
              className="w-full indent-2.5 p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              value={password}
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 rounded bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
        <p className="text-gray-400 mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

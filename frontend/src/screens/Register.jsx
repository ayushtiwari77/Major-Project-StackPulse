import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "../config/axios";
import { useNavigate } from "react-router-dom";
import { UseUser } from "../context/MainContext";

const Register = () => {
  const navigate = useNavigate();
  const { setUser } = UseUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await axios.post("/user/register", {
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
        <h2 className="text-2xl font-bold text-white mb-6">Register</h2>
        <form
          onSubmit={handleSubmit}
          className="flex  w-3/4 text-lg flex-col  items-center"
        >
          <div className="mb-6 w-full  ">
            <label className="block text-gray-400 mb-2" htmlFor="email">
              Email
            </label>
            <input
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              id="email"
              className="w-full p-3 indent-2.5 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-6 w-full">
            <label className="block text-gray-400 mb-2" htmlFor="password">
              Password
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
              type="password"
              id="password"
              className="w-full indent-2.5 p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 rounded bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Register
          </button>
        </form>
        <p className="text-gray-400 mt-4">
          Already have an account?{" "}
          <Link to="/Login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

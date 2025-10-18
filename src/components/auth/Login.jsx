import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../contexts/AuthContext";
import axios from "axios";

const Login = () => {
  const { authUser, setUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (authUser) {
      navigate("/");
    }
  }, [authUser, navigate]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "DRIVER",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_AUTH_BACKEND_URL}/signin`,
        formData,
        { withCredentials: true }
      );

      if (response.data.success) {

        const { user, userId, role } = response.data;

        if (user && userId && role) {
          setUser({ email: user, userId, role });
          navigate("/");
        } else {

          const validate = await axios.get(
            `${import.meta.env.VITE_AUTH_BACKEND_URL}/validate`,
            { withCredentials: true }
          );

          if (validate.data.loggedIn) {
            setUser({
              email: validate.data.user,
              userId: validate.data.userId,
              role: validate.data.role,
            });
            navigate("/");
          } else {
            setError("Login successful, but token not validated.");
          }
        }
      } else {
        setError("Invalid credentials. Try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Login failed. Please check your email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-6 rounded-2xl shadow-md w-96 border border-yellow-500">
        <h1 className="text-3xl font-bold text-center mb-6 text-yellow-400">
          Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1 text-yellow-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-700 text-yellow-100 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-yellow-300">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-700 text-yellow-100 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 py-2 rounded-md font-semibold transition-colors"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

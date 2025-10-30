import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuthStore from "../../contexts/AuthContext";
import { Toast } from "primereact/toast";
import { Helmet } from "react-helmet-async";
import PageMeta from "../common/PageMeta";

const Register = () => {
  const { authUser, setUser } = useAuthStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (authUser) {
      navigate("/");
    }
  }, [authUser, navigate]);

  const toast = useRef(null);

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    aadharCardNumber: "",
    phoneNumber: "",
    password: "",
    role: "DRIVER",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== confirmPassword) {
      toast.current.show({
        severity: "warn",
        summary: "Warning",
        detail: "Passwords do not match",
        life: 3000,
      });
      setLoading(false);
      return;
    }

    if (!agreeToTerms) {
      toast.current.show({
        severity: "warn",
        summary: "Warning",
        detail: "You must agree to the terms",
        life: 3000,
      });
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_AUTH_BACKEND_URL}/signup/driver`,
        formData
      );

      if (res.data) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Driver registered successfully!",
          life: 3000,
        });

        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail:
          err.response?.data?.message ||
          "Problem while registering driver. Try again.",
        life: 3000,
      });
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta page={"register"} />

      <div className="flex flex-col items-center justify-center min-h-screen flex-grow bg-gray-900">
        <Toast ref={toast} />
        <div className="bg-gray-800 p-6 rounded-2xl shadow-md w-96 border border-yellow-500">
          <h1 className="text-3xl font-bold text-center mb-6 text-yellow-400">
            Register a New Driver
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1 text-yellow-300">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-700 text-yellow-100 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            {/* Email */}
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

            {/* Aadhar */}
            <div>
              <label className="block text-sm font-medium mb-1 text-yellow-300">
                Aadhar Card Number
              </label>
              <input
                type="text"
                name="aadharCardNumber"
                value={formData.aadharCardNumber}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-700 text-yellow-100 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-1 text-yellow-300">
                Phone Number
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-700 text-yellow-100 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            {/* Password */}
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-1 text-yellow-300">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-700 text-yellow-100 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            {/* Terms */}
            <div className="flex items-center text-yellow-200">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={() => setAgreeToTerms(!agreeToTerms)}
                className="mr-2 accent-yellow-500"
              />
              <span className="text-sm">
                I agree to the{" "}
                <a href="#" className="text-yellow-400 hover:underline">
                  terms and conditions
                </a>
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !agreeToTerms}
              className={`w-full py-2 font-semibold rounded-md transition ${
                loading || !agreeToTerms
                  ? "bg-gray-600 text-gray-300 cursor-not-allowed opacity-50"
                  : "bg-yellow-500 hover:bg-yellow-400 text-gray-900"
              }`}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;

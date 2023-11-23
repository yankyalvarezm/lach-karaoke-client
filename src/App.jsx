import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import SessionsPage from "./pages/SessionsPage";
import StreamingPage from "./pages/StreamingPage";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/sessions" element={<SessionsPage />} />
      <Route path="/streaming" element={<StreamingPage />} />
      
    </Routes>
  );
}

export default App;

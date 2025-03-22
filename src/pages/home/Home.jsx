import React from "react";
import { useAuth } from "../../context/AuthContext";

const Home = () => {
  const { user } = useAuth(); // Access the authenticated user

  return (
    <div>
      <h2>Welcome to the Job Portal</h2>
      {user && <p>Hello, {user.email}!</p>}
    </div>
  );
};

export default Home;
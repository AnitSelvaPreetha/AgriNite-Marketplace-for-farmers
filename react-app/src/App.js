import "./App.css";
import Header from "./components/Header";
import Home from "./components/Home";
import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

function App() {
  useEffect(() => {
    // Authenticate as a seller when component mounts
    socket.emit("authenticateSeller");

    // Listen for new order notifications
    socket.on("newOrder", (orderDetails) => {
      console.log("New order received:", orderDetails);
      // Handle the new order notification as needed (e.g., display in UI)
    });

    return () => {
      // Cleanup the event listener when the component unmounts
      socket.off("newOrder");
    };
  }, []);
  return (
    <div className="App">
      <Header />
      <Home />
    </div>
  );
}

export default App;

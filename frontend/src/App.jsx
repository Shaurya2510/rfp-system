import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import CreateRfp from "./pages/CreateRFP";
import Vendors from "./pages/Vendors";
import SendRfp from "./pages/SendRfp";
import Proposals from "./pages/Proposals";
import Comparison from "./pages/Comparison";

export default function App() {
  return (
    <BrowserRouter>
      <nav className="bg-white shadow px-8 py-4 flex gap-8 text-gray-700 mb-4">
        <a href="/" className="hover:text-blue-600 font-medium">Home</a>
        <a href="/create-rfp" className="hover:text-blue-600 font-medium">Create RFP</a>
        <a href="/vendors" className="hover:text-blue-600 font-medium">Vendors</a>
        <a href="/send-rfp" className="hover:text-blue-600 font-medium">Send RFP</a>
        <a href="/proposals" className="hover:text-blue-600 font-medium">Proposals</a>
      </nav>


      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-rfp" element={<CreateRfp />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/send-rfp" element={<SendRfp />} />
        <Route path="/proposals" element={<Proposals />} />
        <Route path="/comparison/:rfp_id" element={<Comparison />} />
      </Routes>
    </BrowserRouter>
  );
}

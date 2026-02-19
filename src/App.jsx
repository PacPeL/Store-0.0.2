import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

const Placeholder = ({ title }) => (
  <div style={{ padding: 40 }}>
    <h1>{title}</h1>
  </div>
);

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cart" element={<Placeholder title="Cart" />} />
      <Route path="/profile" element={<Placeholder title="Profile" />} />
      <Route path="/search" element={<Placeholder title="Search" />} />
      <Route path="/menu" element={<Placeholder title="Menu" />} />
      <Route path="/product/:id" element={<Placeholder title="Product details" />} />
      <Route path="/wishlist" element={<Placeholder title="Wishlist" />} />
      <Route path="/orders" element={<Placeholder title="Orders" />} />
      <Route path="/support" element={<Placeholder title="Support" />} />
      <Route path="/settings" element={<Placeholder title="Settings" />} />
      <Route path="/category/:slug" element={<Placeholder title="Category" />} />
    </Routes>
  );
}

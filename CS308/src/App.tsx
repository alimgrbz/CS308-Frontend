import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import Cart from "./pages/Cart";
import ProductIndex from "./pages/ProductIndex"; 
import About from './pages/About';
import Contacts from './pages/Contact';
import Profile from './pages/Profile'
import OrderList from './pages/OrderList';
import OrderDetails from './pages/OrderDetails';
import "./styles/colors.css";
import "./styles/global.css";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/products" element={<ProductIndex />} />
            <Route path="/about" element={<About />}/>
            <Route path="/contact" element={<Contacts />}/>
            <Route path="/profile" element={<Profile />}></Route>
            <Route path="/profile/orders" element={<OrderList />} />
            <Route path="/profile/orders/:orderId" element={<OrderDetails />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);


export default App;

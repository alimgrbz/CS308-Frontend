import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ButtonCustom } from '@/components/ui/button-custom';
import { Package, ShoppingBag, UserRound, Settings, LogOut, Star, Repeat } from 'lucide-react';

const Profile = () => {
  const [userName] = useState('Coffee Lover');
  const [email] = useState('coffee@example.com');
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const filteredOrders = mockPastOrders.filter(order => {
    if (activeTab === 'ongoing') return order.status !== 'Delivered';
    if (activeTab === 'past') return order.status === 'Delivered';
    return true;
  });

  return (
    <div className="container mx-auto py-16 px-4">
      <motion.div 
        className="text-center mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-serif font-bold mt-6 mb-6 text-coffee-green">
          My Profile
        </h1>
      </motion.div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex flex-col items-center">
                <div className="h-24 w-24 rounded-full bg-coffee-green-light/50 flex items-center justify-center mb-4">
                  <UserRound size={64} className="text-coffee-green" />
                </div>
                <CardTitle className="text-xl font-serif text-coffee-green">{userName}</CardTitle>
                <p className="text-coffee-brown mt-1">{email}</p>
              </div>
            </CardHeader>
            <CardContent>
              <nav className="flex flex-col space-y-2">
                <Link to="/profile" className="flex items-center p-3 rounded-md bg-coffee-green-light/30 text-coffee-green font-medium">
                  <UserRound size={18} className="mr-2" />
                  <span>Profile</span>
                </Link>
                <Link to="/past-orders" className="flex items-center p-3 rounded-md hover:bg-coffee-green-light/20 text-coffee-brown hover:text-coffee-green transition-colors">
                  <Package size={18} className="mr-2" />
                  <span>Past Orders</span>
                </Link>
                <Link to="/cart" className="flex items-center p-3 rounded-md hover:bg-coffee-green-light/20 text-coffee-brown hover:text-coffee-green transition-colors">
                  <ShoppingBag size={18} className="mr-2" />
                  <span>Cart</span>
                </Link>
                <Link to="/my-reviews" className="flex items-center p-3 rounded-md hover:bg-coffee-green-light/20 text-coffee-brown hover:text-coffee-green transition-colors">
                  <Star size={18} className="mr-2" />
                  <span>My Reviews</span>
                </Link>
                <Link to="/purchase-again" className="flex items-center p-3 rounded-md hover:bg-coffee-green-light/20 text-coffee-brown hover:text-coffee-green transition-colors">
                  <Repeat size={18} className="mr-2" />
                  <span>Purchase Again</span>
                </Link>
                <Link to="/account" className="flex items-center p-3 rounded-md hover:bg-coffee-green-light/20 text-coffee-brown hover:text-coffee-green transition-colors">
                  <Settings size={18} className="mr-2" />
                  <span>Account Settings</span>
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="flex items-center p-3 rounded-md hover:bg-coffee-green-light/20 text-coffee-brown hover:text-coffee-green transition-colors text-left w-full"
                >
                  <LogOut size={18} className="mr-2" />
                  <span>Sign Out</span>
                </button>
              </nav>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          className="md:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-serif text-coffee-green mb-2">Orders</CardTitle>
              <div className="flex gap-2 mt-2">
                {['all', 'ongoing', 'past'].map(tab => (
                  <button
                    key={tab}
                    className={`px-4 py-1.5 rounded-md font-medium text-sm ${
                      activeTab === tab
                        ? 'bg-coffee-green text-white'
                        : 'bg-coffee-green-light/20 text-coffee-brown'
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === 'all' ? 'All Orders' : tab === 'ongoing' ? 'Ongoing Orders' : 'Past Orders'}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map(order => (
                    <div key={order.id} className="border border-coffee-green/10 rounded-md p-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-coffee-brown">Order #{order.id}</span>
                        <span className="text-sm font-medium text-coffee-green">{order.date}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium text-coffee-brown">Items: {order.items}</span>
                        <span className="font-medium text-coffee-green">${order.total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span 
                          className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}
                        >
                          {order.status}
                        </span>
                        <Link to={`/past-orders#${order.id}`}>
                          <ButtonCustom size="sm" variant="ghost">
                            Details
                          </ButtonCustom>
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-6">
                    <p className="text-coffee-brown mb-4">You haven't placed any orders yet.</p>
                    <Link to="/shop">
                      <ButtonCustom>Browse Products</ButtonCustom>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

// Mock data for the UI
const mockPastOrders = [
  {
    id: '1023',
    date: 'April 2, 2025',
    items: 3,
    total: 42.99,
    status: 'Delivered'
  },
  {
    id: '1045',
    date: 'April 8, 2025',
    items: 2,
    total: 28.50,
    status: 'On the way'
  }
];

const statusColors = {
  'Ordered': 'bg-amber-100 text-amber-800',
  'Getting ready': 'bg-blue-100 text-blue-800',
  'On the way': 'bg-purple-100 text-purple-800',
  'Delivered': 'bg-green-100 text-green-800',
};

export default Profile;
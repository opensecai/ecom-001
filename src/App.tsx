import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import { Navbar } from '@/components/layout/Navbar';
import { Home } from '@/pages/Home';
import { Products } from '@/pages/Products';
import { AdminDashboard } from '@/pages/admin/Dashboard';
import { AdminProducts } from '@/pages/admin/Products';
import { AdminSettings } from '@/pages/admin/Settings';
import { AdminLogin } from '@/pages/admin/Login';
import { PrivateRoute } from '@/components/PrivateRoute';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="app-theme">
      <Router>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <PrivateRoute>
                    <AdminDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <PrivateRoute>
                    <AdminProducts />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <PrivateRoute>
                    <AdminSettings />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
          <Toaster />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
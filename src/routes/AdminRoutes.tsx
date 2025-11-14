import { Route, Routes } from 'react-router-dom';
import { AdminRoute } from '@/components/admin/AdminRoute';
import { Dashboard } from '@/pages/admin/Dashboard';
import { ProductsPage } from '@/pages/admin/ProductsPage';
import { ProductForm } from '@/components/admin/ProductForm';
import { AdminUsers } from '@/pages/admin/AdminUsers';
import { SettingsPage } from '@/pages/admin/SettingsPage';

export function AdminRoutes() {
  return (
    <AdminRoute>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route index element={<div>Admin Dashboard</div>} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/edit/:id" element={<ProductForm isEdit />} />
          <Route path="users" element={<div>Users Management</div>} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="admins" element={<AdminUsers />} />
        </Route>
      </Routes>
    </AdminRoute>
  );
}

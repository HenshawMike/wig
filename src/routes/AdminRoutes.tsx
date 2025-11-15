import { Route, Routes } from 'react-router-dom';
import { AdminRoute } from '@/components/admin/AdminRoute';
import { Dashboard } from '@/pages/admin/Dashboard';
import { ProductsPage } from '@/pages/admin/ProductsPage';
import { ProductForm } from '@/components/admin/ProductForm';
import { AdminUsers } from '@/pages/admin/AdminUsers';
import { UsersPage } from '@/pages/admin/UsersPage';

export function AdminRoutes() {
  return (
    <AdminRoute>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route index element={<div>Admin Dashboard</div>} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/edit/:id" element={<ProductForm isEdit />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="settings" element={<div>Settings</div>} />
          <Route path="admins" element={<AdminUsers />} />
        </Route>
      </Routes>
    </AdminRoute>
  );
}

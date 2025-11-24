// pages/index.tsx
import React from 'react';
import { Layout } from '@/components/Layout/Layout';
import { DashboardOverview } from '@/components/Dashboard/DashboardOverview';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function HomePage() {
  return (
    <ProtectedRoute>
      <Layout title="Tổng quan sản xuất">
        <DashboardOverview />
      </Layout>
    </ProtectedRoute>
  );
}
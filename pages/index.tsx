// pages/index.tsx
import React from 'react';
import { Layout } from '@/components/Layout/Layout';
import { DashboardOverview } from '@/components/Dashboard/DashboardOverview';

export default function HomePage() {
  return (
    <Layout title="Tổng quan sản xuất">
      <DashboardOverview />
    </Layout>
  );
}
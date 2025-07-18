"use client";

import React from 'react'
import dynamic from 'next/dynamic';
import { isAdmin } from '@/lib/admin';
import { redirect } from 'next/navigation';

const App = dynamic(() => import("./app"), { ssr: false });
const AdminPage = () => {
  if(!isAdmin()){
    redirect("/");
  }
  return (
    <App />
  );
};

export default AdminPage
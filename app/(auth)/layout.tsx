import React from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex items-center justify-center h-screen flex-col bg-zinc-800">
      {children}
    </main>
  );
};
export default AuthLayout;
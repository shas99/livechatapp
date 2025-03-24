"use client"
import React from "react";
import { useAuth } from "react-oidc-context";
import { useEffect } from 'react';


export default function Page() {
    const auth = useAuth();

    if (auth.isLoading) {
      return <div className="p-4 text-gray-700">Loading...</div>;
    }
  
    if (auth.error) {
      console.log(auth.error)
      return  <div className="p-4 bg-red-100 text-red-700 border border-red-300 rounded-md">Encountering error... {auth.error.message}</div>;
    }

    if (auth.isAuthenticated) {
      return (
        <div className="p-4 bg-gray-200 min-h-screen flex flex-col items-center justify-center space-y-4">
          <pre className="text-gray-800"> Hello: {auth.user?.profile.email} </pre>
  
          <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600" onClick={() => auth.removeUser()}>Sign out</button>
        </div>
      );
    }

    const signOutRedirect = () => {
      const clientId = process.env.NEXT_PUBLIC_clientId
      const logoutUri =  process.env.NEXT_PUBLIC_logoutUri;
      const cognitoDomain = process.env.NEXT_PUBLIC_cognitoDomain;
      window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(!logoutUri)}`;
    };


    return (
        <div className="p-4 bg-gray-200 min-h-screen flex flex-col items-center justify-center space-y-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={() => auth.signinRedirect()}>Sign in</button>
        {/* <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600" onClick={() => signOutRedirect()}>Sign out</button> */}
      </div>
    )
  }

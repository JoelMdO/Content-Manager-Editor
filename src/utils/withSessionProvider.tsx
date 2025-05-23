"use client";

import { SessionProvider } from "next-auth/react";

const withSessionProvider = (Component: React.FC) => {
  return function WrappedComponent(props: any) {
    return (
      <SessionProvider>
        <Component {...props} />
      </SessionProvider>
    );
  };
};

export default withSessionProvider;

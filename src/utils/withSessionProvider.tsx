"use client";

import { SessionProvider } from "next-auth/react";

const withSessionProvider = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return function WrappedComponent(props: P) {
    return (
      <SessionProvider>
        <Component {...props} />
      </SessionProvider>
    );
  };
};

export default withSessionProvider;

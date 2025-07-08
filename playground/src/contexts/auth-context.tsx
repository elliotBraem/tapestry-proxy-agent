import { fromHex } from "@fastnear/utils";
import { sign } from "near-sign-verify";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { apiClient } from "../lib/api-client";
import { near } from "../lib/near";

interface IAuthContext {
  currentAccountId: string | null;
  isSignedIn: boolean;
  // isAuthorized: boolean;
  handleSignIn: () => Promise<void>;
  handleSignOut: () => Promise<void>;
  // handleAuthorize: () => Promise<void>;
  // checkAuthorization: () => Promise<void>;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export function useAuth(): IAuthContext {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps): React.ReactElement {
  const [currentAccountId, setCurrentAccountId] = useState<string | null>(
    near.accountId() ?? null
  );
  const [isSignedIn, setIsSignedIn] = useState<boolean>(
    near.authStatus() === "SignedIn"
  );
  const [isAuthorized, setIsAuthorized] = useState<boolean>(
    () => localStorage.getItem("isAuthorized") === "true"
  );
  const [nonce, setNonce] = useState<string | null>(null);
  const [recipient, setRecipient] = useState<string | null>(null);
  const hasShownConnectedToast = useRef(false);

  // useEffect(() => {
  //   if (isAuthorized) {
  //     localStorage.setItem("isAuthorized", "true");
  //   } else {
  //     localStorage.removeItem("isAuthorized");
  //   }
  // }, [isAuthorized]);

  // const checkAuthorization = useCallback(async () => {
  //   if (!currentAccountId) {
  //     setIsAuthorized(false);
  //     return;
  //   }
  //   try {
  //     await apiClient.makeRequest("GET", "/users/me");
  //     setIsAuthorized(true);
  //   } catch (error) {
  //     console.error("Authorization check failed:", error);
  //     setIsAuthorized(false);
  //   }
  // }, [currentAccountId]);

  // const initiateLogin = useCallback(async (accountId: string) => {
  //   try {
  //     const { nonce, recipient } = await apiClient.makeRequest<{
  //       nonce: string;
  //       recipient: string;
  //     }>("POST", "/auth/initiate-login", { accountId });
  //     setNonce(nonce);
  //     setRecipient(recipient);
  //   } catch (error) {
  //     console.error("Failed to initiate login:", error);
  //     toast.error("Connection Error", {
  //       description:
  //         "Unable to connect to authentication server. Please try again.",
  //     });
  //   }
  // }, []);

  useEffect(() => {
    const handleAccountChange = (newAccountId: string | null) => {
      setCurrentAccountId(newAccountId);
      setIsSignedIn(!!newAccountId);
      if (!newAccountId) {
        setIsAuthorized(false);
        toast.success("Wallet Disconnected", {
          description: "You have been signed out successfully.",
          duration: 1000,
        });
      }
    };

    const accountListener = near.event.onAccount(handleAccountChange);
    const initialAccountId = near.accountId();
    if (initialAccountId) {
      handleAccountChange(initialAccountId);
    }

    return () => {
      near.event.offAccount(accountListener);
    };
  }, []);

  useEffect(() => {
    if (currentAccountId) {
      if (!isAuthorized) {
        if (!hasShownConnectedToast.current) {
          toast.success("Wallet Connected", {
            description: `Connected as: ${currentAccountId}`,
            duration: 1000,
          });
          hasShownConnectedToast.current = true;
        }
      }
      // checkAuthorization();
      // initiateLogin(currentAccountId);
    }
  }, [currentAccountId, isAuthorized, 
    // checkAuthorization,
    //  initiateLogin
    ]);

  const handleSignIn = async (): Promise<void> => {
    try {
      await near.requestSignIn();
    } catch (e: unknown) {
      toast.error("Sign-in failed", {
        description: e instanceof Error ? e.message : String(e),
      });
    }
  };

  const handleAuthorize = async (): Promise<void> => {
    if (!currentAccountId) {
      toast.error("Not Signed In", {
        description: "Please sign in before authorizing.",
      });
      return;
    }
    if (!nonce || !recipient) {
      toast.error("Authorization not ready", {
        description: "Please try signing back in.",
      });
      handleSignOut();
      return;
    }
    try {
      const message = "Authorize Curate.fun";

      const authToken = await sign(message, {
        signer: near,
        recipient: recipient,
        nonce: fromHex(nonce),
      });

      await apiClient.makeRequest("POST", "/auth/verify-login", {
        token: authToken,
        accountId: currentAccountId,
      });

      setIsAuthorized(true);
      toast.success("Authorization Successful!", {
        description: "You have successfully authorized the application.",
      });
    } catch (e: unknown) {
      setIsAuthorized(false);
      toast.error("Authorization failed", {
        description: e instanceof Error ? e.message : String(e),
      });
    }
  };

  const handleSignOut = async (): Promise<void> => {
    try {
      await apiClient.makeRequest("POST", "/auth/logout");
    } catch (error) {
      console.error(
        "Logout failed on backend, signing out on client anyway.",
        error
      );
    }
    setIsAuthorized(false);
    near.signOut();
  };

  const contextValue: IAuthContext = {
    currentAccountId,
    isSignedIn,
    // isAuthorized,
    handleSignIn,
    handleSignOut,
    // handleAuthorize,
    // checkAuthorization,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

import {
  getDefaultSession,
  handleIncomingRedirect,
} from "@inrupt/solid-client-authn-browser";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const { onCallback } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function handleRedirectAfterLogin() {
      await handleIncomingRedirect();

      const session = getDefaultSession();
      if (session.info.isLoggedIn) {
        onCallback({
          webID: session.info.webId!,
          sessionId: session.info.sessionId!,
          clientId: session.info.clientAppId!,
        });
      }

      navigate("/");
    }

    handleRedirectAfterLogin();
  }, []);

  return <p>Loading...</p>;
}

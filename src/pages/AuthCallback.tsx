import {
  getDefaultSession,
  handleIncomingRedirect,
} from "@inrupt/solid-client-authn-browser";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function AuthCallback() {
  const { onCallback } = useContext(AuthContext);
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

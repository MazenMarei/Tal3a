import { useState, useEffect, SetStateAction } from "react";
import React from "react";
type State = {
  actor: ReturnType<typeof createActor> | undefined;
  authClient: AuthClient | undefined;
  isAuthenticated: boolean;
  principal: string;
};

import { user_canister, createActor } from "../../declarations/user_canister";
import { canisterId } from "../../declarations/user_canister";
import { AuthClient } from "@dfinity/auth-client";
import { Principal } from "@dfinity/principal";
import { Result_1 } from "../../declarations/user_canister/user_canister.did";
const network = process.env.DFX_NETWORK;
const identityProvider =
  network === "ic"
    ? "https://identity.ic0.app"
    : `http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943`;
function App() {
  const [state, setState] = useState<State>({
    actor: undefined,
    authClient: undefined,
    isAuthenticated: false,
    principal: 'Click "Whoami" to see your principal ID',
  });
  const [greeting, setGreeting] = useState("");

  // Initialize auth client
  useEffect(() => {
    updateActor();
  }, []);
  const updateActor = async () => {
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    const actor = createActor(canisterId, {
      agentOptions: {
        identity,
      },
    });
    console.log(actor);
    console.log(authClient);
    const isAuthenticated = await authClient.isAuthenticated();
    setState((prev) => ({
      ...prev,
      actor,
      authClient,
      isAuthenticated,
    }));
  };

  const login = async () => {
    console.log(state);

    if (state.authClient) {
      await state.authClient.login({
        identityProvider,
        onSuccess: updateActor,
      });
    } else {
      console.error("AuthClient is not initialized.");
    }
  };

  const logout = async () => {
    if (state.authClient) {
      await state.authClient.logout();
      updateActor();
    } else {
      console.error("AuthClient is not initialized.");
    }
  };

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const network = process.env.DFX_NETWORK;
    console.log(network);

    const form = event.target as HTMLFormElement;
    const nameInput = form.elements.namedItem("name") as HTMLInputElement;
    const name = nameInput.value;

    if (state.actor) {
      state.actor.get_current_user().then((results: Result_1) => {
        if ("Ok" in results) {
          const principal = results.Ok.principal_id;
          console.log(principal);
          setGreeting(principal.toString());
        } else {
          console.log("Failed to get principal from result:", results.Err);
        }
      });
    } else {
      console.error("Actor is not initialized.");
    }
    return false;
  }

  return (
    <main>
      <img src="/logo2.svg" alt="DFINITY logo" />
      <br />
      <br />
      <form action="#" onSubmit={handleSubmit}>
        <label htmlFor="name">Enter your name: &nbsp;</label>
        <input id="name" alt="Name" type="text" />
        <button type="submit">Click Me test!</button>
        <button type="button" onClick={login}>
          Login
        </button>
        <button type="button" onClick={logout}>
          Logout
        </button>
      </form>
      <section id="greeting">{greeting}</section>
    </main>
  );
}

export default App;

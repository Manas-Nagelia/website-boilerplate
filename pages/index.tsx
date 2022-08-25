import { Session } from "@supabase/supabase-js";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { HeroSection } from "../components/Home/HeroSection";
import { HeaderMenu } from "../components/Navbar/HeaderMenu";
import { supabase } from "../utils/supabaseClient";

const Home: NextPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // only update the react state if the component is still mounted
      if (mounted) {
        if (session) {
          setSession(session);
        }

        setIsLoading(false);
      }
    }

    getInitialSession();

    const { subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      mounted = false;

      subscription?.unsubscribe();
    };
  }, []);

  return (
    <div>
      <Head>
        <title>Admin Center Home</title>
      </Head>
      {!session ? (
        <>
          <HeaderMenu
            links={[
              {
                link: "/login",
                label: "Login",
              },
            ]}
          />{" "}
          <HeroSection />
        </>
      ) : (
        <div>You are logged in</div>
      )}
    </div>
  );
};

export default Home;

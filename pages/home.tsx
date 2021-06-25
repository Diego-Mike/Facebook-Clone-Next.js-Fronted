import Head from "next/head";
import { useState, useEffect } from "react";
import useSWR from "swr";
import axios from "axios";
import { GetStaticProps } from "next";

import Private from "../components/Private/Private";
import LeftSideBar from "../components/Home/LeftSidebar/LeftSideBar";
import { dataObject } from "../GlobalInterfaces/AuthContextInterfaces";
import { Ipublication } from "../GlobalInterfaces/DataInterfaces";
import RightSideBar from "../components/Home/RightSideBar/RightSideBar";
import PublicationsHome from "../components/Home/Publications/PublicationsHome";
import { URL } from "../API/Calls";

const Home = ({ data: allPubs }) => {
  const [userAuth, setUserAuth] = useState<dataObject>({});

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("Auth"));
    setUserAuth(auth);
  }, []);

  // All pubs

  const { data: Publications } = useSWR<Ipublication[]>(
    `${URL}/api/publication`,
    {
      initialData: allPubs,
      revalidateOnFocus: false
    }
  );

  return (
    <div>
      {userAuth ? (
        <>
          <Head>
            <title>Facebook</title>
          </Head>
          {/* Left sidebar */}

          <LeftSideBar UserId={userAuth !== undefined && userAuth} />

          {/* Publicaciones */}

          <PublicationsHome Publications={Publications} />

          {/* Right sidebar */}

          <RightSideBar UserId={userAuth !== undefined && userAuth} />
        </>
      ) : (
        <>
          <Head>
            <title>Loading...</title>
          </Head>
          <Private />
        </>
      )}
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await axios.get(`${process.env.URL}/api/publication`);

  return {
    props: { data },
    revalidate: 3
  };
};

export default Home;

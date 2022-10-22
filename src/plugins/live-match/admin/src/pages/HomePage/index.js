/*
 *
 * HomePage
 *
 */

import React, { memo, useState } from "react";
import { Box } from "@strapi/design-system/Box";
import { TwoColsLayout } from "@strapi/design-system/Layout";
import { useAsyncRetry } from "react-use";
import Worldcup from "../../components/WorldCupIcon";
import matchRequests from "../../api";
import MatchList from "../../components/MatchList";
import MatchView from "../../components/MatchView";

const HomePage = () => {
  const [data, setData] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useAsyncRetry(async () => {
    setIsLoading(true);
    const entries = await matchRequests.findAll();
    setData(entries);
    setIsLoading(false);
  });

  return (
    <>
      <Worldcup />
      <Box padding={8} background="neutral100">
        <TwoColsLayout
          startCol={<MatchView selectedMatch={selectedMatch} />}
          endCol={
            <MatchList
              onSelectedItem={(match) => {
                setSelectedMatch(match);
              }}
              matches={data}
            />
          }
        />
      </Box>
    </>
  );
};

export default memo(HomePage);

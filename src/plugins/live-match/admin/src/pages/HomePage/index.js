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

  const allMatches = useAsyncRetry(async () => {
    setIsLoading(true);
    const entries = await matchRequests.findAll();
    setData(entries);
    setIsLoading(false);
  });

  const sendMatchResult = async (id, data) => {
    try {
      const match = await matchRequests.saveResult(id, data);
      if (match.finished) {
        allMatches.retry();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Worldcup />
      <Box padding={8} background="neutral100">
        <TwoColsLayout
          startCol={
            <MatchView
              sendResult={sendMatchResult}
              selectedMatch={selectedMatch}
            />
          }
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

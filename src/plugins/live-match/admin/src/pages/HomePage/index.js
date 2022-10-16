/*
 *
 * HomePage
 *
 */

import React, { memo, useState } from "react";
import { EmptyStateLayout } from "@strapi/design-system/EmptyStateLayout";
import { Box } from "@strapi/design-system/Box";
import { TwoColsLayout } from "@strapi/design-system/Layout";
import { useAsyncRetry } from "react-use";
import Worldcup from "../../components/WorldCupIcon";
import matchRequests from "../../api";
import { EmptyState } from "../../../../../teams-seeder/admin/src/components/EmptyState";
import {
  Card,
  CardBody,
  CardContent,
  CardBadge,
  CardTitle,
  CardSubtitle,
} from "@strapi/design-system/Card";

const HomePage = () => {
  const [data, setData] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDataState = useAsyncRetry(async () => {
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
          startCol={
            <Box padding={4}>
              {!selectedMatch && (
                <EmptyStateLayout
                  icon={<EmptyState />}
                  content="You haven't selected any match yet..."
                  shadow="none"
                />
              )}
            </Box>
          }
          endCol={
            <Box padding={4}>
              {data.length > 0 &&
                data.map((match) => (
                  <Card
                    style={{
                      width: "240px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <CardBody
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Box>
                        <img
                          style={{ borderRadius: 5 }}
                          src={match.left_side.flag.url}
                          alt={match.left_side.name}
                          width="40"
                          height="30"
                        />
                      </Box>
                      <CardContent>
                        <CardTitle
                          style={{
                            fontSize: 11,
                            marginLeft: 15,
                            marginRight: 15,
                          }}
                        >
                          {match.left_side.name} - {match.right_side.name}
                        </CardTitle>
                        <CardSubtitle
                          style={{
                            fontSize: 9,
                            marginLeft: 15,
                            marginRight: 15,
                            textTransform: "uppercase",
                          }}
                        >
                          Predictions: {match.predictions.length}
                        </CardSubtitle>
                      </CardContent>
                      <Box>
                        <img
                          style={{ borderRadius: 5 }}
                          src={match.right_side.flag.url}
                          alt={match.right_side.name}
                          width="40"
                          height="30"
                        />
                      </Box>
                    </CardBody>
                  </Card>
                ))}
            </Box>
          }
        />
      </Box>
    </>
  );
};

export default memo(HomePage);

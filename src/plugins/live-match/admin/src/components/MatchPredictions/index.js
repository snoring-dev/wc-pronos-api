import React, { useState, useEffect } from "react";
import {
  Table,
  Thead,
  TFooter,
  Tbody,
  Tr,
  Td,
  Th,
} from "@strapi/design-system/Table";
import { Box } from "@strapi/design-system/Box";
import { Flex } from "@strapi/design-system/Flex";
import { Typography } from "@strapi/design-system/Typography";
import { IconButton } from "@strapi/design-system/IconButton";
import { VisuallyHidden } from "@strapi/design-system/VisuallyHidden";
import { Badge } from "@strapi/design-system/Badge";
import Play from "@strapi/icons/Play";
import { nanoid } from "nanoid";
import Magic from "@strapi/icons/Magic";
import Loader from "@strapi/icons/Loader";

function MatchPredictions({
  matchId,
  pronostics,
  parseAllPredictions,
  parseSinglePrediction,
  findTeam,
  findPlayer,
}) {
  const [loading, setLoading] = useState([]);

  useEffect(() => {
    const loadings = pronostics.map((p) => ({
      id: p.id,
      status: false,
      isDone: false,
    }));
    setLoading(loadings);
  }, [pronostics]);

  const getLoadingInstance = (id) => loading.find((l) => l.id === id);

  const changeLoading = (id, flag, isDone) => {
    const loadIndex = loading.findIndex((l) => l.id === id);
    if (loadIndex !== -1) {
      loading[loadIndex].status = flag;
      loading[loadIndex].isDone = isDone;
    }
    setLoading([...loading]);
  };

  const getIcon = (p) => {
    const instance = getLoadingInstance(p.id);
    const isLoading = instance && instance.status && !instance.isDone;
    if (isLoading) return <Loader />;
    if (instance && instance.isDone) return null;
    return <Play />;
  };

  return (
    <Box
      background="neutral0"
      hasRadius={true}
      shadow="filterShadow"
      padding={8}
      style={{ marginTop: "10px" }}
    >
      <Table
        colCount={4}
        rowCount={10}
        footer={
          <TFooter
            onClick={() => parseAllPredictions(matchId, () => console.log('Done!'))}
            icon={<Magic />}
          >
            Parse all predictions
          </TFooter>
        }
      >
        <Thead>
          <Tr>
            <Th>
              <Typography variant="sigma">ID</Typography>
            </Th>

            <Th>
              <Typography variant="sigma">User</Typography>
            </Th>

            <Th>
              <Typography variant="sigma">Team</Typography>
            </Th>

            <Th>
              <Typography variant="sigma">Player</Typography>
            </Th>

            <Th>
              <Typography variant="sigma">Score</Typography>
            </Th>

            <Th>
              <VisuallyHidden>Actions</VisuallyHidden>
            </Th>
          </Tr>
        </Thead>

        <Tbody>
          {pronostics.map((prediction) => {
            const tm = findTeam(prediction.first_team_to_score);
            const pl = findPlayer(prediction.first_player_to_score);
            return (
              <Tr key={nanoid()}>
                <Td>
                  <Typography textColor="neutral800">
                    <Badge active>
                      {prediction.id ? prediction.id : "undefined"}
                    </Badge>
                  </Typography>
                </Td>

                <Td>
                  <Typography textColor="neutral800">
                    {prediction?.owner?.username ?? "N/A"}
                  </Typography>
                </Td>

                <Td>
                  <Typography textColor="neutral800">
                    {tm?.name ?? "N/A"}
                  </Typography>
                </Td>

                <Td>
                  <Typography textColor="neutral800">
                    {pl?.fullname ?? "N/A"}
                  </Typography>
                </Td>

                <Td>
                  <Typography textColor="neutral800">
                    {`${prediction?.predicted_result.leftSide} - ${prediction?.predicted_result.rightSide}`}
                  </Typography>
                </Td>

                <Td>
                  <Flex style={{ justifyContent: "end" }}>
                    {!prediction.parsed && (
                      <Box paddingLeft={1}>
                        <IconButton
                          onClick={async () => {
                            changeLoading(prediction.id, true, false);
                            await parseSinglePrediction(
                              matchId,
                              prediction?.owner?.id,
                              () => changeLoading(prediction.id, false, true)
                            );
                          }}
                          label="Execute"
                          noBorder
                          icon={getIcon(prediction)}
                        />
                      </Box>
                    )}
                  </Flex>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Box>
  );
}

export default MatchPredictions;

import React, { useState, useEffect } from "react";
import { Box } from "@strapi/design-system/Box";
import { EmptyStateLayout } from "@strapi/design-system/EmptyStateLayout";
import { Typography } from "@strapi/design-system/Typography";
import { NumberInput } from "@strapi/design-system/NumberInput";
import { Select, Option } from "@strapi/design-system/Select";
import { Button } from "@strapi/design-system/Button";
import { nanoid } from "nanoid";
import { EmptyState } from "../../../../../teams-seeder/admin/src/components/EmptyState";
import {
  Container,
  MatchOpponents,
  LeftSide,
  Result,
  RightSide,
  ControlPanel,
  FinalScoreInputs,
  WinnerField,
  StrikerField,
  Selections,
  BtnWrapper,
  Legend,
} from "./styles";
import MatchPredictions from "../MatchPredictions";

const initialScore = {
  leftSide: 0,
  rightSide: 0,
  resultString: "0 - 0",
};

function MatchView({ selectedMatch, sendResult = () => {} }) {
  const [finalScore, setFinalScore] = useState(initialScore);
  const [firstPlayerToScore, setFirstPlayerToScore] = useState(null);
  const [firstTeamToScore, setFirstTeamToScore] = useState(null);

  const handleInputChanges = (field, value) => {
    setFinalScore({ ...finalScore, [field]: Number(value) });
  };

  useEffect(() => {
    setFinalScore({
      leftSide: selectedMatch?.left_score ?? 0,
      rightSide: selectedMatch?.right_score ?? 0,
      resultString: selectedMatch?.final_score_string ?? "0 - 0",
    });

    setFirstTeamToScore(selectedMatch?.first_team_to_score);
    setFirstPlayerToScore(selectedMatch?.first_player_to_score);

    console.log('Changed!');
  }, [selectedMatch]);

  if (!selectedMatch) {
    return (
      <Box padding={4}>
        <EmptyStateLayout
          icon={<EmptyState />}
          content="You haven't selected any match yet..."
          shadow="none"
        />
      </Box>
    );
  }

  const {
    left_side: leftSide = null,
    right_side: rightSide = null,
    final_score_string: matchResult = "",
    predictions = [],
    finished = false,
  } = selectedMatch;
  const players = [...leftSide?.players, ...rightSide?.players];

  const setPlayer = (playerId) => {
    const found = players.find((p) => p.id === playerId);
    if (found) {
      setFirstPlayerToScore(found);
    }
  };

  const setTeam = (countryCode) => {
    if (leftSide.country_code === countryCode) {
      setFirstTeamToScore(leftSide);
    } else if (rightSide.country_code === countryCode) {
      setFirstTeamToScore(rightSide);
    }
  };

  const submitResult = () => {
    sendResult(selectedMatch.id, {
      score: {
        ...finalScore,
        resultString: `${finalScore.leftSide} - ${finalScore.rightSide}`,
      },
      firstPlayerToScore: firstPlayerToScore.id,
      firstTeamToScore: firstTeamToScore.id,
    });
  };

  const getTeam = (id) => {
    if (leftSide.id === id) return leftSide;
    if (rightSide.id === id) return rightSide;
    return null;
  };

  const getPlayer = (id) => {
    return players.find((p) => p.id === id);
  };

  return (
    <Container>
      <MatchOpponents>
        <LeftSide>
          <img
            src={leftSide?.flag?.url}
            height={leftSide?.flag?.height}
            width={leftSide?.flag?.width}
            alt={leftSide?.country_code}
          />
          <Typography variant="delta">{leftSide?.name}</Typography>
        </LeftSide>
        <Result>{matchResult}</Result>
        <RightSide>
          <img
            src={rightSide?.flag?.url}
            height={rightSide?.flag?.height}
            width={rightSide?.flag?.width}
            alt={rightSide?.country_code}
          />
          <Typography variant="delta">{rightSide?.name}</Typography>
        </RightSide>
      </MatchOpponents>
      <ControlPanel>
        <FinalScoreInputs>
          <NumberInput
            placeholder={leftSide?.name}
            label={leftSide?.name}
            name={leftSide?.country_code}
            onValueChange={(value) => handleInputChanges("leftSide", value)}
            value={Number(
              finished ? selectedMatch?.left_score : finalScore?.leftSide
            )}
            disabled={finished}
          />
          <Typography variant="alpha">-</Typography>
          <NumberInput
            placeholder={rightSide?.name}
            label={rightSide?.name}
            name={rightSide?.country_code}
            onValueChange={(value) => handleInputChanges("rightSide", value)}
            value={Number(
              finished ? selectedMatch?.right_score : finalScore?.rightSide
            )}
            disabled={finished}
          />
        </FinalScoreInputs>
        <Selections>
          <WinnerField>
            <Select
              disabled={finished}
              className="match-select"
              label="First team to score"
              onChange={(val) => setTeam(val)}
              value={firstTeamToScore?.country_code}
            >
              <Option
                value={leftSide.country_code}
                startIcon={
                  <img
                    width={40}
                    height={30}
                    src={leftSide.flag.url}
                    alt={leftSide.country_code}
                  />
                }
              >
                {leftSide.name}
              </Option>
              <Option
                value={rightSide.country_code}
                startIcon={
                  <img
                    width={40}
                    height={30}
                    src={rightSide.flag.url}
                    alt={rightSide.country_code}
                  />
                }
              >
                {rightSide.name}
              </Option>
            </Select>
          </WinnerField>
          <StrikerField>
            <Select
              disabled={finished}
              size="M"
              label="First player to score"
              onChange={(val) => setPlayer(val)}
              value={firstPlayerToScore?.id}
            >
              {players.map((player) => (
                <Option key={nanoid()} value={player.id}>
                  {player.fullname}
                </Option>
              ))}
            </Select>
          </StrikerField>
        </Selections>
        {!finished && (
          <BtnWrapper>
            <Button onClick={submitResult} fullWidth>
              {"Save final result!".toUpperCase()}
            </Button>
          </BtnWrapper>
        )}
      </ControlPanel>
      <Legend>all predictions</Legend>
      <MatchPredictions
        pronostics={predictions}
        parseAllPredictions={() => {}}
        findTeam={getTeam}
        findPlayer={getPlayer}
      />
    </Container>
  );
}

export default MatchView;

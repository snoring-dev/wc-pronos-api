import React, { useState } from "react";
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
} from "./styles";

const initialScore = {
  leftSide: 0,
  rightSide: 0,
  resultString: "0 - 0",
};

function MatchView({ selectedMatch }) {
  const [finalScore, setFinalScore] = useState(initialScore);
  const [firstPlayerToScore, setFirstPlayerToScore] = useState(null);
  const [firstTeamToScore, setFirstTeamToScore] = useState(null);

  const handleInputChanges = (field, value) => {
    setFinalScore({ ...finalScore, [field]: Number(value) });
  };

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
    console.log("RESULT:", {
      score: {
        ...finalScore,
        resultString: `${finalScore.leftSide} - ${finalScore.rightSide}`,
      },
      firstPlayerToScore,
      firstTeamToScore,
    });
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
            value={finalScore?.leftSide ?? 0}
          />
          <Typography variant="alpha">-</Typography>
          <NumberInput
            placeholder={rightSide?.name}
            label={rightSide?.name}
            name={rightSide?.country_code}
            onValueChange={(value) => handleInputChanges("rightSide", value)}
            value={finalScore?.rightSide ?? 0}
          />
        </FinalScoreInputs>
        <Selections>
          <WinnerField>
            <Select
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
        <BtnWrapper>
          <Button onClick={submitResult} fullWidth>
            {"Save final result!".toUpperCase()}
          </Button>
        </BtnWrapper>
      </ControlPanel>
    </Container>
  );
}

export default MatchView;

import React from "react";
import { nanoid } from "nanoid";
import { Box } from "@strapi/design-system/Box";
import {
  Card,
  CardBody,
  CardContent,
  CardTitle,
  CardSubtitle,
} from "@strapi/design-system/Card";

function MatchList({ matches, onSelectedItem = () => {} }) {
  return (
    <Box padding={4}>
      {matches.length > 0 &&
        matches.map((match) => (
          <Card
            key={nanoid()}
            onClick={() => onSelectedItem(match)}
            style={{
              marginTop: "15px",
              marginBottom: "15px",
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
                  src={match?.left_side?.flag?.url ?? ''}
                  alt={match?.left_side?.name}
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
                  src={match?.right_side?.flag?.url ?? ''}
                  alt={match.right_side.name}
                  width="40"
                  height="30"
                />
              </Box>
            </CardBody>
          </Card>
        ))}
    </Box>
  );
}

export default MatchList;

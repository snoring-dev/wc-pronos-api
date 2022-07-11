import React from "react";
import {
  ModalLayout,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "@strapi/design-system/ModalLayout";
import { Button } from "@strapi/design-system/Button";
import { Typography } from "@strapi/design-system/Typography";
import ReactJson from "react-json-view";
import ReactCountryFlag from "react-country-flag";

function SeedViewModal({ countryCode, jsonData, onClose }) {
  return (
    <ModalLayout onClose={onClose} labelledBy="title">
      <ModalHeader>
        <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
          <ReactCountryFlag
            countryCode={countryCode.slice(0, -1)}
            svg
            style={{
              fontSize: "1.7em",
              lineHeight: "1.7em",
              marginRight: "8px",
            }}
          />
          <strong>{countryCode}</strong>
        </Typography>
      </ModalHeader>
      <ModalBody>
        <ReactJson src={jsonData} />
      </ModalBody>
      <ModalFooter
        endActions={
          <>
            <Button onClick={onClose}>Close</Button>
          </>
        }
      />
    </ModalLayout>
  );
}

export { SeedViewModal };

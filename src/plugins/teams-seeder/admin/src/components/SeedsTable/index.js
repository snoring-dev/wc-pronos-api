import React, { useState } from "react";
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
import { Button } from "@strapi/design-system/Button";
import { Typography } from "@strapi/design-system/Typography";
import { IconButton } from "@strapi/design-system/IconButton";
import { VisuallyHidden } from "@strapi/design-system/VisuallyHidden";
import { BaseCheckbox } from "@strapi/design-system/BaseCheckbox";
import { TextInput } from "@strapi/design-system/TextInput";
import { Badge } from "@strapi/design-system/Badge";
import Eye from "@strapi/icons/Eye";
import Trash from "@strapi/icons/Trash";
import Plus from "@strapi/icons/Plus";
import Play from "@strapi/icons/Play";
import ReactCountryFlag from "react-country-flag";
import { nanoid } from "nanoid";

function SeedCheckbox({ value, checkboxID, callback, disabled }) {
  const [isChecked, setIsChecked] = useState(value);

  function handleChange() {
    setIsChecked(!isChecked);
    {
      callback && callback({ id: checkboxID, value: !isChecked });
    }
  }

  return (
    <BaseCheckbox
      checked={isChecked}
      onChange={handleChange}
      disabled={disabled}
    />
  );
}

function SeedInput({ value, onChange }) {
  return (
    <TextInput
      type="text"
      aria-label="todo-input"
      name="todo-input"
      error={value.length > 40 ? "Text should be less than 40 characters" : ""}
      onChange={onChange}
      value={value}
    />
  );
}

function SeedsTable({
  seedsData,
  toggleSeed,
  deleteSeed,
  parseSeed,
  setShowModal,
  setSelectedSeed,
}) {
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
          <TFooter onClick={() => setShowModal(true)} icon={<Plus />}>
            Add new seed
          </TFooter>
        }
      >
        <Thead>
          <Tr>
            <Th>
              <Typography variant="sigma">ID</Typography>
            </Th>

            <Th>
              <Typography variant="sigma">Team Code</Typography>
            </Th>

            <Th>
              <Typography variant="sigma">Status</Typography>
            </Th>

            <Th>
              <VisuallyHidden>Actions</VisuallyHidden>
            </Th>
          </Tr>
        </Thead>

        <Tbody>
          {seedsData.map((seed) => {
            return (
              <Tr key={seed.id ? seed.id : nanoid()}>
                <Td>
                  <Typography textColor="neutral800">
                    <Badge active>{seed.id ? seed.id : "undefined"}</Badge>
                  </Typography>
                </Td>

                <Td>
                  <Typography textColor="neutral800">
                    <ReactCountryFlag
                      countryCode={
                        seed.country_code.length > 2
                          ? seed.country_code.slice(0, -1)
                          : seed.country_code
                      }
                      svg
                      style={{
                        fontSize: "1.7em",
                        lineHeight: "1.7em",
                        marginRight: "8px",
                      }}
                    />
                    {seed.country_code}
                  </Typography>
                </Td>

                <Td>
                  <SeedCheckbox
                    value={seed.parsed}
                    checkboxID={seed.id}
                    callback={toggleSeed}
                  />
                </Td>

                <Td>
                  <Flex style={{ justifyContent: "end" }}>
                    <Box paddingLeft={1}>
                      <IconButton
                        onClick={() => setSelectedSeed(seed)}
                        label="Show"
                        noBorder
                        icon={<Eye />}
                      />
                    </Box>
                    <Box paddingLeft={1}>
                      <IconButton
                        onClick={() => deleteSeed(seed.id)}
                        label="Delete"
                        noBorder
                        icon={<Trash />}
                      />
                    </Box>
                    {!seed.parsed && (
                      <Box paddingLeft={1}>
                        <IconButton
                          onClick={() => parseSeed(seed.id)}
                          label="Parse Seed"
                          noBorder
                          icon={<Play />}
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

export { SeedsTable };

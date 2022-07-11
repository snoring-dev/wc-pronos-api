import React, { useState } from "react";

import {
  ModalLayout,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Typography,
  Button,
  TextInput,
  Textarea,
} from "@strapi/design-system";
import { Box } from "@strapi/design-system/Box";
import { nanoid } from "nanoid";

function AddSeedModal({ setShowModal, addSeed }) {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    // Prevent submitting parent form
    e.preventDefault();
    e.stopPropagation();

    try {
      await addSeed({
        id: nanoid(),
        parsed: false,
        country_code: name,
        players_payload: content,
      });
      setShowModal(false);
    } catch (e) {
      console.log("error", e);
    }
  };

  const getError = () => {
    return null;
  };

  const getContent = () => {
    let content = '';
    try {
      content = JSON.stringify(content);
    } catch(e) {
      //
    }

    return content;
  }

  return (
    <ModalLayout
      onClose={() => setShowModal(false)}
      labelledBy="title"
      as="form"
      onSubmit={handleSubmit}
    >
      <ModalHeader>
        <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
          Add Team name
        </Typography>
      </ModalHeader>

      <ModalBody>
        <Box padding={2}>
          <TextInput
            placeholder="What team are we gonna seed?"
            label="Name"
            name="text"
            error={getError()}
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </Box>
        <Box padding={2}>
          <Textarea
            placeholder="players JSON goes here"
            label="Players payload"
            name="content"
            hint="Be sure you add a valid JSON"
            onChange={(e) => setContent(JSON.parse(e.target.value))}
          >
            {JSON.stringify(content)}
          </Textarea>
        </Box>
      </ModalBody>

      <ModalFooter
        startActions={
          <Button onClick={() => setShowModal(false)} variant="tertiary">
            Cancel
          </Button>
        }
        endActions={<Button type="submit">Add seed</Button>}
      />
    </ModalLayout>
  );
}

export { AddSeedModal };

import React, { memo, useEffect, useState } from "react";
import { EmptyStateLayout } from "@strapi/design-system/EmptyStateLayout";
import { BaseHeaderLayout, ContentLayout } from "@strapi/design-system/Layout";
import { LoadingIndicatorPage } from "@strapi/helper-plugin";
import { Button } from "@strapi/design-system/Button";
import Plus from "@strapi/icons/Plus";
import { EmptyState } from "../../components/EmptyState";
import { AddSeedModal } from "../../components/AddSeedModal";
import { SeedsTable } from "../../components/SeedsTable";
import SeedsCount from "../../components/SeedsCount";
import teamSelectionApi from "../../api/team-selection";
import { useAsyncRetry } from "react-use";
import { SeedViewModal } from "../../components/SeedViewModal";

// import PropTypes from 'prop-types';

const HomePage = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isViewerShown, setViewerShown] = useState(false);
  const [selectedSeed, setSelectedSeed] = useState(null);

  const fetchDataState = useAsyncRetry(async () => {
    setIsLoading(true);
    const seeds = await teamSelectionApi.findAll();
    setData(seeds);
    setIsLoading(false);
  });

  async function addSeed(newEntry) {
    await teamSelectionApi.addSeed(newEntry);
    fetchDataState.retry();
  }

  async function toggleSeed(id) {
    await teamSelectionApi.toggleSeed(id);
    fetchDataState.retry();
  }

  async function deleteSeed(id) {
    await teamSelectionApi.deleteSeed(id);
    fetchDataState.retry();
  }

  async function parseSeed(id) {
    await teamSelectionApi.parseSeed(id);
    await teamSelectionApi.toggleSeed(id);
    fetchDataState.retry();
  }

  if (isLoading) return <LoadingIndicatorPage />;

  return (
    <>
      <BaseHeaderLayout
        title="Teams Seeding Plugin"
        subtitle="Start adding players to their teams here"
        as="h2"
      />

      <ContentLayout>
        {data.length === 0 ? (
          <EmptyStateLayout
            icon={<EmptyState />}
            content="You don't have any seeds yet..."
            action={
              <Button
                onClick={() => setShowModal(true)}
                variant="secondary"
                startIcon={<Plus />}
              >
                Add your first Seed
              </Button>
            }
          />
        ) : (
          <>
            <SeedsCount count={data.length} />

            <SeedsTable
              seedsData={data}
              setShowModal={setShowModal}
              toggleSeed={toggleSeed}
              deleteSeed={deleteSeed}
              parseSeed={parseSeed}
              setSelectedSeed={(seed) => {
                setSelectedSeed(seed);
                setViewerShown(true);
              }}
            />
          </>
        )}

        {showModal && (
          <AddSeedModal setShowModal={setShowModal} addSeed={addSeed} />
        )}
        {isViewerShown && (
          <SeedViewModal
            countryCode={selectedSeed.country_code}
            jsonData={selectedSeed.players_payload}
            onClose={() => setViewerShown(false)}
          />
        )}
      </ContentLayout>
    </>
  );
};

export default memo(HomePage);

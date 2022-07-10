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
import teamSelectionApi from '../../api/team-selection';

// import PropTypes from 'prop-types';

const HomePage = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    if (isLoading === false) setIsLoading(true);
    const seeds = await teamSelectionApi.findAll();
    setData(seeds);
    setIsLoading(false);
  }

  useEffect(async () => {
    await fetchData();
  },[]);

  async function addSeed(newEntry) {
    setData([...data, { ...newEntry }]);
  }

  async function toggleSeed(data) {
    alert("Add Toggle Seed in API");
  }

  async function deleteSeed(data) {
    alert("Add Delete Seed in API");
  }

  async function editSeed(id, data) {
    alert("Add Edit Seed in API");
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
            content="You don't have any todos yet..."
            action={
              <Button
                onClick={() => setShowModal(true)}
                variant="secondary"
                startIcon={<Plus />}
              >
                Add your first todo
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
              editSeed={editSeed}
            />
          </>
        )}

        {showModal && <AddSeedModal setShowModal={setShowModal} addSeed={addSeed} />}
      </ContentLayout>
    </>
  );
};

export default memo(HomePage);

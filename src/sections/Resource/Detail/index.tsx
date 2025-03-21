// eslint-disable jsx-a11y/media-has-caption
// @ts-nocheck

import MediaPlayer from 'react-player';
import { useParams } from 'react-router';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import BlockContent from '@sanity/block-content-to-react';

import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { client } from 'src/utils/sanity/client';

import { CONFIG } from 'src/config';
import { maxLine } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';

import { BackToTop } from 'src/components/animate';
import { Breadcrumbs } from 'src/components/Breadcrumbs';
import { LoadingScreen } from 'src/components/loading-screen';

export default function Detail() {
  const { slug } = useParams();

  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any[]>([]);

  const CONTENT_QUERY = `*[_type == "post" && slug.current == "${slug}"] {
    ...,
    category->,
    body
  }`;

  useEffect(() => {
    client
      .fetch(CONTENT_QUERY)
      .then((content) => setData(content))
      .catch((error) => console.log('error => ', error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => setLoading(!data.length), [data]);

  const current = data.length ? data[0] : {};

  const renderLoading = <LoadingScreen />;

  const renderContent = (
    <DashboardContent>
      <Breadcrumbs
        heading="Resources"
        links={[{ name: 'Resources', href: '#' }, { name: current.title }]}
        sx={{
          mb: { xs: 2, md: 3 },
        }}
      />

      <BackToTop />

      <Stack>
        <Typography variant="h4">{current.title}</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {current.date}, {current.category?.title}
        </Typography>

        <Grid container sx={{ mb: 2 }}>
          <Grid xl={6}>
            <MediaPlayer url={current.videoUrl} controls />
          </Grid>
          <Grid xl={6}>
            <Typography sx={{ ...maxLine({ line: 10 }), mb: 3 }}>{current.quickSummary}</Typography>
          </Grid>
        </Grid>

        <Stack sx={{ mb: 3 }}>
          <BlockContent blocks={current.summaryText} projectId="1s9yly1w" dataset="development" />
        </Stack>

        <Divider flexItem sx={{ mb: 2, borderWidth: 2, background: '#000000' }} />

        <Stack>
          {current.fullTranscript?.map((item: any) => (
            <Typography sx={{ mb: 2 }} variant={item.style}>
              {item?.children[0].text}
            </Typography>
          ))}
        </Stack>
      </Stack>
    </DashboardContent>
  );

  return (
    <>
      <Helmet>
        <title>{`${CONFIG.site.name} / resources`}</title>
      </Helmet>

      {loading ? renderLoading : renderContent}
    </>
  );
}

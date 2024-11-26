import { useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from 'src/components/Iconify';
import { ScrollBar } from 'src/components/ScrollBar';

import { useFetchTopRecruiters } from '../useApollo';

export default function Latest() {
  const { loading, topRecruiteres, fetchTopRecruiters } = useFetchTopRecruiters();

  useEffect(() => {
    fetchTopRecruiters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card sx={{ mt: 2 }}>
      <CardHeader title="Top Recruiters" />

      <ScrollBar sx={{ minHeight: 260 }}>
        <Box
          sx={{
            py: 1,
            gap: 3,
          }}
        >
          {loading ? (
            <Paper sx={{ p: 3 }}>
              <Skeleton variant="text" sx={{ fontSize: 25 }} />
              <Skeleton variant="text" sx={{ fontSize: 25 }} />
              <Skeleton variant="text" sx={{ fontSize: 25 }} />
              <Skeleton variant="text" sx={{ fontSize: 25 }} />
              <Skeleton variant="text" sx={{ fontSize: 25 }} />
            </Paper>
          ) : (
            <Stack sx={{ mt: 2 }}>
              {topRecruiteres.map((item, index) => (
                <Stack
                  sx={{
                    gap: 1,
                    minWidth: 120,
                    px: 3,
                    py: 1,
                    alignItems: 'center',
                  }}
                  direction="row"
                  justifyContent="space-between"
                  divider={<Divider sx={{ borderStyle: 'dashed', p: 0 }} />}
                >
                  <Stack direction="row" columnGap={1} sx={{ alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        display: 'flex',
                        borderRadius: '50%',
                        alignItems: 'center',
                        color: 'primary.main',
                        justifyContent: 'center',
                        bgcolor: (theme) => varAlpha(theme.vars.palette.primary.mainChannel, 0.08),
                        ...(index === 1 && {
                          color: 'info.main',
                          bgcolor: (theme) => varAlpha(theme.vars.palette.info.mainChannel, 0.08),
                        }),
                        ...(index === 2 && {
                          color: 'error.main',
                          bgcolor: (theme) => varAlpha(theme.vars.palette.error.mainChannel, 0.08),
                        }),
                      }}
                    >
                      <Iconify width={24} icon="solar:cup-star-bold" />
                    </Box>
                    <Typography variant="subtitle1">{item.fullName}</Typography>
                  </Stack>
                  <Stack direction="row" sx={{ alignItems: 'center' }} columnGap={1}>
                    <Typography variant="body1">{item.totalIntroducers}</Typography>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          )}
        </Box>
      </ScrollBar>
    </Card>
  );
}

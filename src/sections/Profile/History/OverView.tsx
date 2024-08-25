import type { Member } from 'src/__generated__/graphql';

import { useQuery as useGraphQuery } from '@apollo/client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';

import { fDate } from 'src/utils/format-time';
import { fNumber } from 'src/utils/formatNumber';

import { FETCH_MEMBER_HISTORY } from '../query';

interface Props {
  me: Member;
}

export default function OverView({ me }: Props) {
  const { data } = useGraphQuery(FETCH_MEMBER_HISTORY, {
    variables: {
      data: { id: me.id },
    },
  });

  return (
    <Card sx={{ mr: 2, mt: 2, py: 3, textAlign: 'center', typography: 'h4' }}>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
      >
        <Stack width={1}>
          {fNumber(data?.memberOverview.currentHashPower ?? 0)}
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            Hash Power
          </Box>
        </Stack>

        <Stack width={1}>
          {fNumber((data?.memberOverview.totalTXCShared ?? 0) / 10 ** 8)}
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            Total TXC Reward
          </Box>
        </Stack>

        <Stack width={1}>
          {fDate(data?.memberOverview.joinDate ?? new Date())}
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            Join Date
          </Box>
        </Stack>
      </Stack>
    </Card>
  );
}

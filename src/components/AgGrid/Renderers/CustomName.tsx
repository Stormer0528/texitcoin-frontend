import { memo } from 'react';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

interface Props {
  id: string;
  username: string;
  email: string;
}

export const CustomName = memo(({ id, username, email }: Props) => {
  const router = useRouter();

  return (
    <Stack
      sx={{
        cursor: 'pointer',
        '&:hover': { bgcolor: (theme) => theme.vars.palette.action.hover },
      }}
      onClick={() => {
        router.push(paths.dashboard.members.edit(id));
      }}
    >
      <ListItemText
        primary={username}
        secondary={
          <Typography
            variant="body2"
            color={(theme) => theme.palette.text.disabled}
            sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {email}
          </Typography>
        }
        primaryTypographyProps={{ typography: 'body2' }}
        secondaryTypographyProps={{
          component: 'span',
          color: 'text.disabled',
        }}
      />
    </Stack>
  );
});

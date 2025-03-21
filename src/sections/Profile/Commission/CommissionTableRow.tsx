import type { WeeklyCommission } from 'src/__generated__/graphql';

import dayjs from 'dayjs';
import utcPlugin from 'dayjs/plugin/utc';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';

// ----------------------------------------------------------------------
dayjs.extend(utcPlugin);

type Props = {
  row: WeeklyCommission;
};

export default function CommissionTableRow({ row }: Props) {
  const { begL, begR, newL, newR, maxL, maxR, endL, endR, pkgL, pkgR, commission, weekStartDate } =
    row;

  return (
    <TableRow hover>
      <TableCell align="left">
        <ListItemText
          primary={dayjs(weekStartDate).utc().format('MMM-ww')}
          secondary={`${dayjs(weekStartDate).utc().format('MM/DD')} - ${dayjs(weekStartDate).utc().add(6, 'day').format('MM/DD')}`}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />
      </TableCell>
      <TableCell align="left">{`L${begL}, R${begR}`}</TableCell>
      <TableCell align="left">{`L${newL}, R${newR}`}</TableCell>
      <TableCell align="left">{`L${maxL}, R${maxR}`}</TableCell>
      <TableCell align="left">{`L${pkgL}, R${pkgR}`}</TableCell>
      <TableCell align="left">{`L${endL}, R${endR}`}</TableCell>
      <TableCell align="left">{commission ?? 0}</TableCell>
    </TableRow>
  );
}

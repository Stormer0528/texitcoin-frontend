import { useEffect } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { OTHER_WALLET } from 'src/consts';

import { Field } from 'src/components/Form';
import { Iconify } from 'src/components/Iconify';

interface Props {
  wallets: any[];
}

interface Wallet {
  id: string;
  payoutId?: string;
  address?: string;
  percent?: number;
}

export default function OtherWallets({ wallets }: Props) {
  const { control, setValue } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: 'otherWallets' });

  const forms: Wallet[] = fields?.length
    ? fields
    : wallets.map(({ id, payoutId, address, percent }) => ({
        id,
        payoutId,
        address,
        percent,
      }));

  useEffect(() => {
    wallets.forEach(({ payoutId, address, note }, index) => {
      setValue(`otherWallets[${index}].payoutId`, payoutId);
      setValue(`otherWallets[${index}].address`, address);
      setValue(`otherWallets[${index}].note`, note);
      setValue(`otherWallets[${index}].percent`, 0);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallets]);

  const addWallet = () => {
    append({
      payoutId: '',
      address: '',
      note: '',
      percent: 0,
    });
  };

  const handleRemove = (index: number) => {
    remove(index);
  };

  return (
    <Card sx={{ p: 3, mb: 2 }}>
      <Typography sx={{ pb: 2 }} variant="subtitle1">
        Other Wallets
      </Typography>
      {forms?.map((item, index) => (
        <Stack key={item.id} sx={{ mb: 1 }}>
          <Box
            key={item.id}
            rowGap={3}
            columnGap={1}
            display="grid"
            sx={{ mb: 1, gridTemplateColumns: '30% auto' }}
          >
            <Field.Select
              name={`otherWallets[${index}].payoutId`}
              label="Payout"
              defaultValue={item.payoutId}
              size="small"
            >
              {OTHER_WALLET.map((option) => (
                <MenuItem key={option?.id} value={option?.id}>
                  {option?.method}
                </MenuItem>
              ))}
            </Field.Select>

            <Field.Text
              name={`otherWallets[${index}].address`}
              label="Address"
              defaultValue={item.address}
              size="small"
            />
          </Box>
          <Box display="grid" sx={{ gridTemplateColumns: '90% auto' }}>
            <Field.Text name={`otherWallets[${index}].note`} label="Note" size="small" />

            <Button
              size="small"
              color="error"
              sx={{ mt: 1.5, width: 80 }}
              startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
              onClick={() => handleRemove(index)}
            />
          </Box>
        </Stack>
      ))}
      <Divider flexItem sx={{ borderStyle: 'dashed', mb: 1 }} />
      <IconButton
        size="small"
        color="default"
        sx={{
          borderRadius: 0,
          '&:hover': { background: 'transparent', color: '#00A76F' },
        }}
        onClick={addWallet}
      >
        <Iconify icon="bxs:plus-circle" sx={{ mr: 1 }} />
        <Typography>Add Item</Typography>
      </IconButton>
    </Card>
  );
}

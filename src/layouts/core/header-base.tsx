import type { NavSectionProps } from 'src/components/nav-section';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import { Logo } from 'src/components/logo';
import Password from 'src/components/Password';

import Notification from 'src/sections/Notification';

import { HeaderSection } from './header-section';
import { MenuButton } from '../components/menu-button';
import { AccountDrawer } from '../components/account-drawer';
import { SettingsButton } from '../components/settings-button';

import type { HeaderSectionProps } from './header-section';
import type { AccountDrawerProps } from '../components/account-drawer';
import type { WorkspacesPopoverProps } from '../components/workspaces-popover';

// ----------------------------------------------------------------------

export type HeaderBaseProps = HeaderSectionProps & {
  onOpenNav: () => void;
  data?: {
    nav?: NavSectionProps['data'];
    account?: AccountDrawerProps['data'];
    workspaces?: WorkspacesPopoverProps['data'];
  };
  slots?: {
    navMobile?: {
      topArea?: React.ReactNode;
      bottomArea?: React.ReactNode;
    };
  };
  slotsDisplay?: {
    account?: boolean;
    settings?: boolean;
    searchbar?: boolean;
    workspaces?: boolean;
    menuButton?: boolean;
  };
};

export function HeaderBase({
  sx,
  data,
  slots,
  slotProps,
  onOpenNav,
  layoutQuery,
  slotsDisplay: { account = true, settings = true, workspaces = true, menuButton = true } = {},
  ...other
}: HeaderBaseProps) {
  const theme = useTheme();
  const token = localStorage.getItem('token');

  return (
    <HeaderSection
      sx={sx}
      layoutQuery={layoutQuery}
      slots={{
        ...slots,
        leftAreaStart: slots?.leftAreaStart,
        leftArea: (
          <>
            {slots?.leftAreaStart}

            {/* -- Menu button -- */}
            {menuButton && (
              <MenuButton
                data-slot="menu-button"
                onClick={onOpenNav}
                sx={{ mr: 1, ml: -1, [theme.breakpoints.up(layoutQuery)]: { display: 'none' } }}
              />
            )}

            {!token && <Logo data-slot="logo" />}

            {slots?.leftAreaEnd}
          </>
        ),
        rightArea: (
          <>
            {slots?.rightAreaStart}

            <Box
              data-area="right"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 1, sm: 1.5 },
              }}
            >
              {/* -- Settings button -- */}
              {settings && <SettingsButton data-slot="settings" />}

              {/* -- Update Password button -- */}
              {account && <Password />}

              {/* -- Update Password button -- */}
              {account && <Notification />}

              {/* -- Account drawer -- */}
              {account && <AccountDrawer data-slot="account" data={data?.account} />}
            </Box>

            {slots?.rightAreaEnd}
          </>
        ),
      }}
      slotProps={slotProps}
      {...other}
    />
  );
}

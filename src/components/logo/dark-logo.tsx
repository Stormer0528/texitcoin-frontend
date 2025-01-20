import { forwardRef } from 'react';

import Link from '@mui/material/Link';
import Box, { type BoxProps } from '@mui/material/Box';

import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/config';

// ----------------------------------------------------------------------

export interface DarkLogoProps extends BoxProps {
  disabledLink?: boolean;
}

const DarkLogo = forwardRef<HTMLDivElement, DarkLogoProps>(
  ({ disabledLink = false, sx, ...other }, ref) => {
    // OR using local (public folder)
    // -------------------------------------------------------
    const logo = (
      <Box
        component="img"
        src={`${CONFIG.site.basePath}/assets/images/dark-logo.png`}
        sx={{ width: 70, height: 70, cursor: 'pointer', ...sx }}
      />
    );

    if (disabledLink) {
      return logo;
    }

    return (
      <Link component={RouterLink} href="/intro" sx={{ display: 'contents' }}>
        {logo}
      </Link>
    );
  }
);

export default DarkLogo;

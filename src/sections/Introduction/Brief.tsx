import styled from 'styled-components';

import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/config';

import { Image } from 'src/components/Image';

export default function Brief() {
  return (
    <Container>
      <Content container sx={{ mt: '50px' }} alignItems="center">
        <Grid xs={12} md={6}>
          <TexitTitle>TEXITcoin is your</TexitTitle>
          <TexitTitle>
            <strong>second chance</strong> at
          </TexitTitle>
          <TexitTitle>crypto.</TexitTitle>
          <Line />

          <Typography sx={{ mt: 4 }}>
            {`Faster, cheaper and better than Bitcoin in almost every way, our passionate affiliates are
          on track to make $TXC bigger than the world's leading crypto. Join us, help secure the
          TEXITcoin network, and play an active role in the success of $TXC.`}
          </Typography>

          <JoinButton>Join Now</JoinButton>
        </Grid>
        <Grid xs={12} md={6} display="flex" justifyContent="flex-end">
          <Image src={`${CONFIG.site.basePath}/assets/images/texitcoin-key.png`} />
        </Grid>
      </Content>
    </Container>
  );
}

const Content = styled(Grid)`
  font-family: sans-serif;
  margin-top: 50px;
  padding: 32px;
`;

const TexitTitle = styled(Typography)`
  font-size: 3rem;
  line-height: 1.1;
`;

const Line = styled(Divider)`
  width: 20%;
  margin: 20px 0px;
  border: 1.2px solid #000000;
`;

const JoinButton = styled(Button)`
  color: #ffffff;
  background-color: #262262;
  padding: 10px 30px;
  border-radius: 25px;
  font-weight: 600;
  box-shadow: 5px 5px 20px 0 rgba(0, 0, 0, 0.4);
  font-family: sans-serif;
  margin: 30px 0px 20px;
`;

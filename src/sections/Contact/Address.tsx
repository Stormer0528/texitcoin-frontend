import styled from 'styled-components';

import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/Iconify';

export default function Address() {
  return (
    <CustomPaper>
      <Container>
        <ContactContent container>
          <ContactItem xs={12} md={6} lg={4}>
            <ContactAvatar icon="lineicons:telegram" />
            <Title>TELEGRAM</Title>
            <Text>
              @<a href="https://t.me/blockchainmint">BlockchainMint</a> (general inquiries)
            </Text>
            <Text>
              @<a href="https://t.me/texitcoin_txc">TEXITcoin_TXC</a> (announcements)
            </Text>
          </ContactItem>
          <ContactItem xs={12} md={6} lg={4}>
            <ContactAvatar icon="solar:phone-bold" />
            <Title>PHONE (or TEXT)</Title>
            <Text>+1 484 MINE TXC</Text>
            <Text>+1 484 646 3892</Text>
          </ContactItem>
          <ContactItem xs={12} md={6} lg={4}>
            <ContactAvatar icon="icomoon-free:location" />
            <Title>OUR OFFICE LOCATION</Title>
            <Text>424 Rose Garden Drive</Text>
            <Text>McKinney, Republic of Texas</Text>
          </ContactItem>
        </ContactContent>
        <LocationContent container>
          <Grid xs={12} md={6} sx={{ p: 4 }}>
            <Header>Get in Touch</Header>
            <Typography>
              Have an inquiry or some feedbak for us? Fill out the form below to contact our team.
            </Typography>

            <Form>
              <Typography>Name</Typography>
              <CustomField fullWidth placeholder="Enter your Name" />

              <Typography>Email</Typography>
              <CustomField fullWidth placeholder="Enter a valid email address" />

              <Typography>How can we help?</Typography>
              <CustomField fullWidth rows={4} multiline />
            </Form>
          </Grid>
          <Grid xs={12} md={6}>
            <Map
              title="McKinney"
              src="https://maps.google.com/maps?output=embed&amp;q=McKinney%2C%20Texas&amp;z=10&amp;t=m"
              data-map="JTdCJTIyYWRkcmVzcyUyMiUzQSUyMk1jS2lubmV5JTJDJTIwVGV4YXMlMjIlMkMlMjJ6b29tJTIyJTNBMTAlMkMlMjJ0eXBlSWQlMjIlM0ElMjJyb2FkJTIyJTJDJTIybGFuZyUyMiUzQW51bGwlMkMlMjJhcGlLZXklMjIlM0FudWxsJTJDJTIybWFya2VycyUyMiUzQSU1QiU1RCU3RA=="
            >
              {' '}
            </Map>
          </Grid>
        </LocationContent>
      </Container>
    </CustomPaper>
  );
}

const CustomPaper = styled(Paper)`
  background: #262262;
  border-radius: 0;
  margin-top: 100px;
  padding-bottom: 40px;
`;

const ContactContent = styled(Grid)`
  background: #f2f2f2;
  margin-top: -60px;
`;

const LocationContent = styled(Grid)`
  margin: 100px 30px 0;
  background: #ffffff;
  text-align: center;
`;

const ContactItem = styled(Grid)`
  margin-top: -40px;
  text-align: center;
  padding-bottom: 40px;
`;

const Form = styled(Paper)`
  text-align: left;
  padding: 20px 0;
`;

const Title = styled(Typography)`
  margin: 20px 0 10px;
  font-size: 1.25rem;
  font-weight: 700;
  line-spacing: 1px;
  font-family: 'Open sans' sans-serif !important;
`;

const Header = styled(Typography)`
  font-size: 3rem;
`;

const Text = styled(Typography)`
  line-height: 2;
`;

const ContactAvatar = styled(Iconify)`
  width: 100px;
  height: 100px;
  color: #478ac9;
  border: 2px solid #262262;
  border-radius: 50%;
  padding: 15px;
`;

const CustomField = styled(TextField)`
  margin-bottom: 20px;
`;

const Map = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

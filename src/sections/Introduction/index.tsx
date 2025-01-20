import { useLocation } from 'react-router';
import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { BackToTop } from 'src/components/animate/back-to-top';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';

import Brief from './Brief';
import Quick from './Quick';
import Steps from './Steps';
import Texit from './Texit';
import Footer from './Footer';
import WhatsIn from './WhatsIn';
import Packages from './Packages';
import { SignUpView } from '../SignUp';

export default function Introduction() {
  const router = useRouter();
  const { search } = useLocation();
  const pageProgress = useScrollProgress();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (search.includes('sign-up')) {
      window.scrollTo({ top: 4000, behavior: 'smooth' });
    }
  }, [search]);

  // useEffect(() => {
  //   const signUp = document.getElementById('stormer-sign-up');

  //   if (signUp) {
  //     signUp.focus();
  //   }
  // }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY); // Update the state with the current scrollY value
    };

    // Add the scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array ensures this effect runs only once

  useEffect(() => {
    if (scrollY < 4000 && scrollY > 0) {
      router.push(paths.pages.intro.root);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollY]);

  return (
    <Stack>
      <ScrollProgress
        variant="linear"
        progress={pageProgress.scrollYProgress}
        sx={{ position: 'fixed' }}
      />

      <BackToTop />

      <Stack sx={{ position: 'relative' }}>
        <Brief />

        <WhatsIn />

        <Quick />

        <Steps />

        <Texit />

        <Packages />

        <Container id="stormer-sign-up" tabIndex={-1}>
          <SignUpView />
        </Container>

        <Footer />
      </Stack>
    </Stack>
  );
}

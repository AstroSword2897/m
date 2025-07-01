import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Paper, InputAdornment, IconButton, Checkbox, FormControlLabel, Link as MuiLink } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import './SignIn.css';

const SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [newsOptIn, setNewsOptIn] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recaptchaToken) {
      setError('Please complete the reCAPTCHA.');
      return;
    }
    try {
      const response = await axios.post('/api/users/login', { email, password, recaptchaToken });
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to sign in. Please check your credentials.');
      console.error(err);
    }
  };

  return (
    <Container maxWidth="xs" className="signin-container" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8, borderRadius: 4 }}>
        <Typography variant="h3" component="h1" align="center" fontWeight={700} gutterBottom>
          StudyFlow
        </Typography>
        <Typography variant="h5" align="center" fontWeight={600} gutterBottom>
          Sign in with email
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword((show) => !show)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ my: 2, display: 'flex', justifyContent: 'center' }}>
            <ReCAPTCHA
              sitekey={SITE_KEY}
              onChange={token => setRecaptchaToken(token)}
            />
          </Box>
          <FormControlLabel
            control={<Checkbox checked={newsOptIn} onChange={e => setNewsOptIn(e.target.checked)} />}
            label={<span>Email me StudyFlow news and tips<br /><Typography variant="caption">You can opt out at any time</Typography></span>}
            sx={{ mb: 2 }}
          />
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button component={Link} to="/" variant="outlined">
              Back
            </Button>
            <Button type="submit" variant="contained">
              Next
            </Button>
          </Box>
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2">
              Don't have an account?{' '}
              <Link to="/signup">
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <MuiLink href="#" underline="hover" color="text.secondary">
          Contact Us / Support
        </MuiLink>
      </Box>
    </Container>
  );
};

export default SignIn; 
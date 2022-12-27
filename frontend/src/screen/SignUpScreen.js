import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Input from '../components/Input';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getError } from '../utils';
export default function SignUpScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const { search } = useLocation();
  const urlRedirect = new URLSearchParams(search).get('redirect');
  const redirect = urlRedirect ? urlRedirect : '/';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('password and confirm should be equal');
    } else {
      try {
        const { data } = await axios.post('/api/users/signup', {
          name,
          email,
          password,
        });
        ctxDispatch({ type: 'USER_SIGNIN', payload: data });
        localStorage.setItem('userInfo', JSON.stringify(data));
        navigate(redirect || '/');
      } catch (err) {
        toast.error(getError(err));
      }
    }
  };
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, navigate, redirect]);
  return (
    <div>
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
      <Form onSubmit={handleSubmit}>
        <Input
          value={name}
          label="Name"
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          value={email}
          label="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          value={password}
          label="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          value={confirmPassword}
          label="Confirm Password"
          type="password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button type="submit">signUp</Button>
      </Form>
      <div className="my-2">
        Already Have Account?{' '}
        <Link to={`/signin?redirect=${redirect}`} className="link-primary">
          Sign-in
        </Link>
      </div>
    </div>
  );
}

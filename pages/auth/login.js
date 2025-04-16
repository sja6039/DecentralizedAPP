/*
Simple login page with email and password fields. Gives a warning if email or password are wrong.
Link to sign up page if user doesn't have an account.
*/
import React, { useState } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { useStateContext } from '@/context/StateContext'
import { login } from '@/backend/Auth'
import Link from 'next/link'
import Navbar from '@/components/Dashboard/Navbar'

const Login = () => {
  const { setUser } = useStateContext()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleLogin() {
    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }
    try {
      await login(email, password)
      router.push('/')
    } catch (err) {
      console.log('Error Logging In', err)
      setError('Invalid email or password. Please try again.')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin()
    }
  }

  return (
    <>
      <Navbar />
      <PageContainer>
        <LoginCard>
          <Header>Log in to your account</Header>

          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <FormGroup>
            <InputTitle htmlFor="email">Email</InputTitle>
            <Input 
              id="email"
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </FormGroup>
          
          <FormGroup>
            <InputTitle htmlFor="password">Password</InputTitle>
            <Input 
              id="password"
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </FormGroup>
          
          <MainButton 
            onClick={handleLogin} 
            disabled={isLoading}
          >
            Login
          </MainButton>
          
          <SignupPrompt>
            Don't have an account?
            <Link href="/signup" passHref>
              <SignupLink href="/auth/signup">Sign up</SignupLink>
            </Link> 
          </SignupPrompt>
        </LoginCard>
      </PageContainer>
    </>
  )
}

// Styled Components
const PageContainer = styled.div`
  font: 16px 'Roboto', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 70px); /* Adjust based on navbar height */
  padding: 20px;
  background-color: #f8f9fa;
  background-image: url('/images/mainback.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  background-blend-mode: darken;
  background-color: rgba(0, 0, 0, 0.5);
`;

const LoginCard = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  padding: 32px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Header = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: border-color 0.2s;
  outline: none;
  
  &:focus {
    border-color: #3D8D7A;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
  
  &::placeholder {
    color: #aaa;
  }
`;

const InputTitle = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #555;
  margin-bottom: 8px;
`;

const MainButton = styled.button`
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  background-color: #3D8D7A;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
  
  &:hover {
    background-color: #B3D8A8;
  }
  
  &:active {
    transform: scale(0.98);
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background-color: #fff0f0;
  color: #e74c3c;
  border: 1px solid #ffcccc;
  border-radius: 4px;
  padding: 12px 16px;
  margin-bottom: 20px;
  font-size: 14px;
`;

const SignupPrompt = styled.p`
  font-size: 14px;
  color: #666;
  margin-top: 24px;
  text-align: center;
`;

const SignupLink = styled(Link)`
  color: #007bff;
  font-weight: 600;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

export default Login
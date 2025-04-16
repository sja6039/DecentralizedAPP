/*
Same as login page with same UI.
Fields to enter email and password to sign up and make an account.
Link to login page if user already has an account.
*/
import React, { useState } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { useStateContext } from '@/context/StateContext'
import { isEmailInUse, register } from '@/backend/Auth'
import Link from 'next/link'
import Navbar from '@/components/Dashboard/Navbar'

const Signup = () => {
  const { user, setUser } = useStateContext()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  async function validateEmail() {
    const emailRegex = /^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (emailRegex.test(email) === false) {
      setError('Please enter a valid email address')
      return false;
    }
    
    console.log('so far so good...')
    const emailResponse = await isEmailInUse(email)
    console.log('email response', emailResponse)
    if (emailResponse.length > 0) {
      setError('This email is already in use')
      return false;
    }
    return true;
  }

  async function handleSignup() {
    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }
        
    try {
      // First validate the email format and availability
      const isValidEmail = await validateEmail()
      if (!isValidEmail) {
        return
      }
      
      // Try to register
      const response = await register(email, password, setUser)
      router.push('/')
    } catch (err) {
      console.log('Error Signing Up', err)
      
      // Check if the error is related to an email already in use
      if (err.message && err.message.includes('email-already-in-use')) {
        setError('This email is already in use')
      } else {
        setError('An error occurred during signup. Please try again.')
      }
    }
  }

  return (
    <>
      <Navbar />
      <PageContainer>
        <SignupCard>
          <Header>Create your account</Header>

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
            onClick={handleSignup}
          >
            Sign Up
          </MainButton>
          
          <LoginPrompt>
            Already have an account?
            <Link href="/auth/login" passHref>
              <LoginLink href="/auth/login">Log in</LoginLink>
            </Link> 
          </LoginPrompt>
        </SignupCard>
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

const SignupCard = styled.section`
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

const LoginPrompt = styled.p`
  font-size: 14px;
  color: #666;
  margin-top: 24px;
  text-align: center;
`;

const LoginLink = styled.a`
  color: #007bff;
  font-weight: 600;
  text-decoration: none;
  margin-left: 5px;
  
  &:hover {
    text-decoration: underline;
  }
`;

export default Signup
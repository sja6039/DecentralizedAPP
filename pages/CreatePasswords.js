/*
 * Create Password page for KeyForge
 * This page allows users to create and securely store new passwords
 * Users can generate strong passwords, categorize them, and add details
 */
import { useState } from 'react';
import styled from 'styled-components';
import Navbar from '@/components/Dashboard/Navbar';
import { Lock, Shield, RefreshCw, Copy, Eye, EyeOff, CheckCircle } from 'lucide-react';

const passwordCategories = [
  "Social Media",
  "Email",
  "Shopping",
  "Banking",
  "Work",
  "Entertainment",
  "Gaming",
  "Travel",
  "Education",
  "Healthcare",
  "Other"
];

export default function CreatePassword() {
  const [passwordLength, setPasswordLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [passwordName, setPasswordName] = useState('');
  const [username, setUsername] = useState('');
  const [website, setWebsite] = useState('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [strength, setStrength] = useState(0);

  const generatePassword = () => {
    const chars = [
      includeLowercase ? 'abcdefghijklmnopqrstuvwxyz' : '',
      includeUppercase ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : '',
      includeNumbers ? '0123456789' : '',
      includeSymbols ? '!@#$%^&*()_+~`|}{[]:;?><,./-=' : ''
    ].join('');
    
    if (!chars.length) {
      alert('Please select at least one character type');
      return;
    }
    
    let password = '';
    for (let i = 0; i < passwordLength; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    setGeneratedPassword(password);
    calculateStrength(password);
  };

  const calculateStrength = (password) => {
    // Simple password strength calculation
    let score = 0;
    
    // Length check
    if (password.length >= 12) score += 2;
    else if (password.length >= 8) score += 1;
    
    // Character variety checks
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    setStrength(Math.min(5, score));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPassword);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSave = () => {
    if (!passwordName || !generatedPassword || !category) {
      alert('Please fill in all required fields');
      return;
    }
    
    setIsSaving(true);
    
    // This would be replaced with actual blockchain storage logic
    setTimeout(() => {
      setIsSaving(false);
      // Reset form
      setPasswordName('');
      setUsername('');
      setWebsite('');
      setNotes('');
      setCategory('');
      setGeneratedPassword('');
      setIsPasswordVisible(false);
      // Show success message or redirect
    }, 2000);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <Container>
      <Navbar />
      <PageContent>
        <PageHeader>
          <HeaderTitle>Create New Password</HeaderTitle>
          <HeaderDescription>
            Generate strong, unique passwords and securely store them on the blockchain
          </HeaderDescription>
        </PageHeader>

        <ContentGrid>
          <GeneratorCard>
            <CardTitle>
              <Lock size={20} />
              Password Generator
            </CardTitle>

            <GeneratorOptions>
              <RangeGroup>
                <RangeLabel>
                  Password Length: <LengthValue>{passwordLength}</LengthValue>
                </RangeLabel>
                <RangeInput
                  type="range"
                  min="8"
                  max="32"
                  value={passwordLength}
                  onChange={(e) => setPasswordLength(Number(e.target.value))}
                />
                <RangeMarks>
                  <span>8</span>
                  <span>16</span>
                  <span>24</span>
                  <span>32</span>
                </RangeMarks>
              </RangeGroup>

              <OptionsGroup>
                <CheckboxGroup>
                  <Checkbox
                    type="checkbox"
                    id="uppercase"
                    checked={includeUppercase}
                    onChange={() => setIncludeUppercase(!includeUppercase)}
                  />
                  <CheckboxLabel htmlFor="uppercase">Uppercase Letters (A-Z)</CheckboxLabel>
                </CheckboxGroup>

                <CheckboxGroup>
                  <Checkbox
                    type="checkbox"
                    id="lowercase"
                    checked={includeLowercase}
                    onChange={() => setIncludeLowercase(!includeLowercase)}
                  />
                  <CheckboxLabel htmlFor="lowercase">Lowercase Letters (a-z)</CheckboxLabel>
                </CheckboxGroup>

                <CheckboxGroup>
                  <Checkbox
                    type="checkbox"
                    id="numbers"
                    checked={includeNumbers}
                    onChange={() => setIncludeNumbers(!includeNumbers)}
                  />
                  <CheckboxLabel htmlFor="numbers">Numbers (0-9)</CheckboxLabel>
                </CheckboxGroup>

                <CheckboxGroup>
                  <Checkbox
                    type="checkbox"
                    id="symbols"
                    checked={includeSymbols}
                    onChange={() => setIncludeSymbols(!includeSymbols)}
                  />
                  <CheckboxLabel htmlFor="symbols">Special Characters (!@#$...)</CheckboxLabel>
                </CheckboxGroup>
              </OptionsGroup>

              <GenerateButton onClick={generatePassword}>
                <RefreshCw size={18} />
                Generate Password
              </GenerateButton>
            </GeneratorOptions>

            {generatedPassword && (
              <PasswordResult>
                <PasswordDisplay isVisible={isPasswordVisible}>
                  {isPasswordVisible ? generatedPassword : '•'.repeat(generatedPassword.length)}
                </PasswordDisplay>
                <PasswordActions>
                  <ActionButton onClick={togglePasswordVisibility}>
                    {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                  </ActionButton>
                  <ActionButton onClick={copyToClipboard}>
                    {isCopied ? <CheckCircle size={18} /> : <Copy size={18} />}
                  </ActionButton>
                </PasswordActions>
                <StrengthMeter>
                  <StrengthLabel>Strength:</StrengthLabel>
                  <StrengthBars>
                    <StrengthBar active={strength >= 1} level={strength} />
                    <StrengthBar active={strength >= 2} level={strength} />
                    <StrengthBar active={strength >= 3} level={strength} />
                    <StrengthBar active={strength >= 4} level={strength} />
                    <StrengthBar active={strength >= 5} level={strength} />
                  </StrengthBars>
                  <StrengthText level={strength}>
                    {strength === 0 && 'Not Generated'}
                    {strength === 1 && 'Very Weak'}
                    {strength === 2 && 'Weak'}
                    {strength === 3 && 'Medium'}
                    {strength === 4 && 'Strong'}
                    {strength === 5 && 'Very Strong'}
                  </StrengthText>
                </StrengthMeter>
              </PasswordResult>
            )}
          </GeneratorCard>

          <DetailsCard>
            <CardTitle>
              <Shield size={20} />
              Password Details
            </CardTitle>

            <FormGroup>
              <FormLabel htmlFor="passwordName">Password Name*</FormLabel>
              <FormInput
                id="passwordName"
                type="text"
                placeholder="e.g. Facebook Account"
                value={passwordName}
                onChange={(e) => setPasswordName(e.target.value)}
                required
              />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="category">Category*</FormLabel>
              <FormSelect
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select a category</option>
                {passwordCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </FormSelect>
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="username">Username/Email (optional)</FormLabel>
              <FormInput
                id="username"
                type="text"
                placeholder="johndoe@example.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="website">Website URL (optional)</FormLabel>
              <FormInput
                id="website"
                type="text"
                placeholder="https://example.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="notes">Notes (optional)</FormLabel>
              <FormTextarea
                id="notes"
                placeholder="Add any additional information or reminders"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </FormGroup>

            <SaveButton onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Encrypting & Saving...' : 'Save Password Securely'}
            </SaveButton>

            <EncryptionNote>
              <Lock size={14} />
              Your password will be encrypted with your personal key before being stored on the blockchain
            </EncryptionNote>
          </DetailsCard>
        </ContentGrid>
      </PageContent>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: #f0f0ff;
  font-family: 'Roboto', sans-serif;
`;

const PageContent = styled.main`
  flex: 1;
  padding: 2.5rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const PageHeader = styled.header`
  margin-bottom: 2.5rem;
  text-align: center;
`;

const HeaderTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(to right, #9d4edd, #5a189a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeaderDescription = styled.p`
  font-size: 1.1rem;
  color: #b0b0cc;
  max-width: 600px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: rgba(30, 30, 60, 0.3);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(123, 44, 191, 0.2);
  backdrop-filter: blur(10px);
`;

const GeneratorCard = styled(Card)``;

const DetailsCard = styled(Card)`
  display: flex;
  flex-direction: column;
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #d8bfff;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(123, 44, 191, 0.3);
`;

const GeneratorOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const RangeGroup = styled.div`
  margin-bottom: 1rem;
`;

const RangeLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const LengthValue = styled.span`
  background: rgba(123, 44, 191, 0.2);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
  color: #d8bfff;
`;

const RangeInput = styled.input`
  width: 100%;
  height: 6px;
  -webkit-appearance: none;
  background: rgba(123, 44, 191, 0.2);
  border-radius: 5px;
  outline: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #7b2cbf;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(123, 44, 191, 0.5);
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #7b2cbf;
    cursor: pointer;
    border: none;
    box-shadow: 0 0 10px rgba(123, 44, 191, 0.5);
  }
`;

const RangeMarks = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.3rem;
  font-size: 0.8rem;
  color: #b0b0cc;
`;

const OptionsGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Checkbox = styled.input`
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background-color: rgba(30, 30, 60, 0.5);
  border: 1px solid rgba(123, 44, 191, 0.5);
  cursor: pointer;
  position: relative;
  
  &:checked {
    background-color: #7b2cbf;
    border-color: #5a189a;
  }
  
  &:checked:after {
    content: '✓';
    font-size: 14px;
    color: white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const CheckboxLabel = styled.label`
  cursor: pointer;
  color: #b0b0cc;
`;

const GenerateButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: linear-gradient(to right, #7b2cbf, #5a189a);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(90, 24, 154, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const PasswordResult = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(20, 20, 40, 0.5);
  border-radius: 8px;
  border: 1px solid rgba(123, 44, 191, 0.3);
`;

const PasswordDisplay = styled.div`
  font-family: monospace;
  font-size: 1.2rem;
  padding: 1rem;
  background: rgba(10, 10, 20, 0.5);
  border-radius: 6px;
  color: ${props => props.isVisible ? '#d8bfff' : '#b0b0cc'};
  margin-bottom: 1rem;
  overflow-x: auto;
  white-space: nowrap;
  letter-spacing: ${props => props.isVisible ? 'normal' : '0.15rem'};
`;

const PasswordActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(123, 44, 191, 0.2);
  border: none;
  border-radius: 6px;
  width: 36px;
  height: 36px;
  cursor: pointer;
  color: #d8bfff;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(123, 44, 191, 0.4);
  }
`;

const StrengthMeter = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const StrengthLabel = styled.span`
  font-size: 0.9rem;
  color: #b0b0cc;
`;

const StrengthBars = styled.div`
  display: flex;
  gap: 4px;
  flex-grow: 1;
`;

const StrengthBar = styled.div`
  height: 8px;
  flex-grow: 1;
  border-radius: 4px;
  background-color: ${props => props.active 
    ? props.level <= 2 
      ? '#ff4757' 
      : props.level === 3 
        ? '#ffa502' 
        : '#2ed573'
    : 'rgba(123, 44, 191, 0.1)'
  };
  transition: all 0.3s ease;
`;

const StrengthText = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => 
    props.level <= 2 
      ? '#ff4757' 
      : props.level === 3 
        ? '#ffa502' 
        : props.level >= 4 
          ? '#2ed573'
          : '#b0b0cc'
  };
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  background: rgba(20, 20, 40, 0.5);
  border: 1px solid rgba(123, 44, 191, 0.3);
  border-radius: 6px;
  color: #f0f0ff;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #7b2cbf;
    box-shadow: 0 0 0 2px rgba(123, 44, 191, 0.2);
  }
  
  &::placeholder {
    color: rgba(176, 176, 204, 0.5);
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 0.8rem 1rem;
  background: rgba(20, 20, 40, 0.5);
  border: 1px solid rgba(123, 44, 191, 0.3);
  border-radius: 6px;
  color: #f0f0ff;
  font-family: inherit;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #7b2cbf;
    box-shadow: 0 0 0 2px rgba(123, 44, 191, 0.2);
  }
  
  option {
    background: #16213e;
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.8rem 1rem;
  background: rgba(20, 20, 40, 0.5);
  border: 1px solid rgba(123, 44, 191, 0.3);
  border-radius: 6px;
  color: #f0f0ff;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: #7b2cbf;
    box-shadow: 0 0 0 2px rgba(123, 44, 191, 0.2);
  }
  
  &::placeholder {
    color: rgba(176, 176, 204, 0.5);
  }
`;

const SaveButton = styled.button`
  padding: 1rem;
  background: linear-gradient(to right, #7b2cbf, #5a189a);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  margin-top: 1rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(90, 24, 154, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background: linear-gradient(to right, #7b2cbf90, #5a189a90);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const EncryptionNote = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #b0b0cc;
  margin-top: 1rem;
  padding: 0.8rem;
  background: rgba(123, 44, 191, 0.1);
  border-radius: 6px;
  border-left: 3px solid #7b2cbf;
`;
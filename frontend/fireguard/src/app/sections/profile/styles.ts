import styled from 'styled-components';

export const Container = styled.div`
  max-width: 42rem; /* 2xl = 42rem */
  margin: 0 auto;
  padding: 1.5rem; /* p-6 */
`;

export const Card = styled.div`
  background-color: bg-gray-200; 
  border-radius: 0.5rem; /* rounded-lg */
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1); /* shadow-lg */
  padding: 1.5rem; /* p-6 */
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem; /* space-x-4 */
  margin-bottom: 1.5rem; /* mb-6 */
`;

export const Avatar = styled.div`
  width: 4rem; /* w-16 */
  height: 4rem; /* h-16 */
  background-color: #e5e7eb; /* bg-gray-200 */
  border-radius: 9999px; /* rounded-full */
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const UserName = styled.h2`
  font-size: 1.25rem; /* text-xl */
  font-weight: 700; /* font-bold */
`;

export const UserRole = styled.p`
  color: #4b5563; /* text-gray-600 */
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem; /* space-y-4 */
`;

export const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

export const Label = styled.label`
  display: block;
  font-size: 0.875rem; /* text-sm */
  font-weight: 500; /* font-medium */
  color: #374151; /* text-gray-700 */
  margin-bottom: 0.25rem; /* mb-1 */
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem; /* px-3 py-2 */
  border: 1px solid var(--your-border-color);
  border-radius: 0.375rem; /* rounded-md */
  background-color: var(--your-input-bg);
  color: var(--your-text-color);
  &::placeholder {
    color: var(--your-placeholder-color);
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem; /* space-x-2 */
`;

export const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.5rem 1rem; /* px-4 py-2 */
  border-radius: 0.375rem; /* rounded-md */
  
  ${props => props.variant === 'primary' && `
    background-color: var(--your-primary-color);
    color: var(--your-primary-text-color);
    &:hover {
      background-color: var(--your-primary-hover-color);
    }
  `}
  
  ${props => props.variant === 'secondary' && `
    background-color: var(--your-secondary-color);
    color: var(--your-secondary-text-color);
    &:hover {
      background-color: var(--your-secondary-hover-color);
    }
  `}
`;

export const ProfileDetail = styled.div`
  margin-bottom: 1rem; /* mb-4 */
`;

export const DetailLabel = styled.span`
  font-weight: 500; /* font-medium */
`;

// Animation keyframes for loading state
export const loadingAnimation = `
  @keyframes shimmer {
    0% {
      background-position: -468px 0;
    }
    100% {
      background-position: 468px 0;
    }
  }
`;

// Loading skeleton styles
export const LoadingSkeleton = styled.div`
  background: #f6f7f8;
  background-image: linear-gradient(
    to right,
    #f6f7f8 0%,
    #edeef1 20%,
    #f6f7f8 40%,
    #f6f7f8 100%
  );
  background-repeat: no-repeat;
  background-size: 800px 104px;
  animation-duration: 1.5s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: shimmer;
  animation-timing-function: linear;
`;

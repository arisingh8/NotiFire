import styled from 'styled-components';
import { Card as AntCard } from 'antd';

export const ProfileContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

export const ProfileCard = styled(AntCard)`
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  
  .ant-card-body {
    padding: 24px;
  }
`;

export const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  
  .ant-avatar {
    margin-right: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

export const ProfileInfo = styled.div`
  margin-left: 16px;
  
  h4 {
    margin-bottom: 4px;
  }
`;

export const FormSection = styled.div`
  max-width: 500px;
  
  .ant-form-item {
    margin-bottom: 24px;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

export const ProfileDetails = styled.div`
  display: grid;
  gap: 16px;
  
  .detail-item {
    display: flex;
    align-items: baseline;
    
    .label {
      font-weight: 500;
      min-width: 120px;
      color: rgba(0, 0, 0, 0.65);
    }
    
    .value {
      color: rgba(0, 0, 0, 0.85);
    }
  }
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

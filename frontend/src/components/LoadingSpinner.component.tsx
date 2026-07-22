import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = { sm: 'text-lg', md: 'text-3xl', lg: 'text-5xl' };

  return (
    <div className={`flex justify-center py-20 ${className}`}>
      <FontAwesomeIcon
        icon={faSpinner}
        spin
        className={`text-impala-brown ${sizeClasses[size]}`}
      />
    </div>
  );
};

export default LoadingSpinner;

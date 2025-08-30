import { Link as RouterLink } from 'react-router-dom';

const Link = ({ to, className = '', children, ...props }) => {
  return (
    <RouterLink
      to={to}
      className={`inline-block text-center no-underline transition-colors ${className}`}
      {...props}
    >
      {children}
    </RouterLink>
  );
};

export { Link };
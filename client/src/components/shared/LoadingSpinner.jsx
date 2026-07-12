import { ImSpinner3 } from 'react-icons/im';

export default function LoadingSpinner({ fullPage = false, size = 'md' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-secondary/80 z-50">
        <ImSpinner3 className={`${sizes.lg} text-primary-600 animate-spin`} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <ImSpinner3 className={`${sizes[size]} text-primary-600 animate-spin`} />
    </div>
  );
}

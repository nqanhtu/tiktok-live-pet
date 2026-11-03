import React from 'react';

interface FoodSvgIconProps {
  foodId: string;
  className?: string;
}

export const FoodSvgIcon: React.FC<FoodSvgIconProps> = ({ foodId, className = 'w-10 h-10' }) => {
  switch (foodId) {
    case 'clover':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <path d="M32 34C32 44 27 52 22 57" stroke="#059669" strokeWidth="4" strokeLinecap="round" />
          <path
            d="M32 31C24 22 14 25 16 34C18 42 29 38 32 31Z"
            fill="#10B981"
            stroke="#047857"
            strokeWidth="2"
          />
          <path
            d="M32 31C40 22 50 25 48 34C46 42 35 38 32 31Z"
            fill="#34D399"
            stroke="#047857"
            strokeWidth="2"
          />
          <path
            d="M32 31C23 19 25 9 32 13C39 9 41 19 32 31Z"
            fill="#10B981"
            stroke="#047857"
            strokeWidth="2"
          />
          <circle cx="29" cy="19" r="2.2" fill="#ECFDF5" />
          <circle cx="41" cy="31" r="1.8" fill="#ECFDF5" />
        </svg>
      );

    case 'carrot':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <path
            d="M39 18C42 10 49 8 51 12C53 16 46 21 41 22"
            fill="#22C55E"
            stroke="#15803D"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M37 16C36 8 41 5 44 8C47 11 42 17 39 19"
            fill="#16A34A"
            stroke="#15803D"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M28 19C35 15 45 24 42 32C39 40 23 54 16 55C13 55 12 52 13 49C15 41 22 23 28 19Z"
            fill="#F97316"
            stroke="#C2410C"
            strokeWidth="2.5"
          />
          <path d="M27 26L33 29" stroke="#EA580C" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M23 35L30 39" stroke="#EA580C" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M19 44L24 46" stroke="#EA580C" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M31 22C34 23 36 26 35 29" stroke="#FFEDD5" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'strawberry':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <path
            d="M32 16C45 16 50 28 45 41C41 50 36 55 32 55C28 55 23 50 19 41C14 28 19 16 32 16Z"
            fill="#F43F5E"
            stroke="#BE123C"
            strokeWidth="2.5"
          />
          <path
            d="M22 18C26 14 32 19 32 19C32 19 38 14 42 18C39 22 32 23 32 23C32 23 25 22 22 18Z"
            fill="#10B981"
            stroke="#047857"
            strokeWidth="2"
          />
          <path d="M32 11V18" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="26" cy="29" r="1.6" fill="#FEF08A" />
          <circle cx="36" cy="28" r="1.6" fill="#FEF08A" />
          <circle cx="31" cy="35" r="1.6" fill="#FEF08A" />
          <circle cx="24" cy="39" r="1.6" fill="#FEF08A" />
          <circle cx="38" cy="38" r="1.6" fill="#FEF08A" />
          <circle cx="32" cy="46" r="1.6" fill="#FEF08A" />
          <path d="M22 25C20 29 21 34 22 36" stroke="#FFE4E6" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );

    case 'mochi':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <ellipse cx="32" cy="48" rx="22" ry="6" fill="#10B981" stroke="#047857" strokeWidth="2" />
          <path
            d="M14 44C14 29 21 21 32 21C43 21 50 29 50 44C50 48 42 50 32 50C22 50 14 48 14 44Z"
            fill="#FCE7F3"
            stroke="#DB2777"
            strokeWidth="2.5"
          />
          <circle cx="24" cy="39" r="2.5" fill="#F472B6" />
          <circle cx="40" cy="39" r="2.5" fill="#F472B6" />
          <circle cx="27" cy="36" r="1.6" fill="#831843" />
          <circle cx="37" cy="36" r="1.6" fill="#831843" />
          <path d="M30 38Q32 40 34 38" stroke="#831843" strokeWidth="1.8" strokeLinecap="round" />
          <path
            d="M32 21C34 15 41 14 41 18C41 21 35 22 32 21Z"
            fill="#34D399"
            stroke="#059669"
            strokeWidth="1.8"
          />
        </svg>
      );

    case 'boba':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <path d="M36 9L31 50" stroke="#EC4899" strokeWidth="4.5" strokeLinecap="round" />
          <path
            d="M19 22H45L41 53C40.6 55.2 38.7 57 36.5 57H27.5C25.3 57 23.4 55.2 23 53L19 22Z"
            fill="#FDE68A"
            stroke="#92400E"
            strokeWidth="2.5"
          />
          <path
            d="M20.5 30Q26 33 32 30T43.5 30L41 53C40.6 55 38.8 56.5 36.5 56.5H27.5C25.2 56.5 23.4 55 23 53L20.5 30Z"
            fill="#D97706"
            fillOpacity="0.45"
          />
          <path
            d="M17 22C17 15 24 13 32 13C40 13 47 15 47 22H17Z"
            fill="#F8FAFC"
            stroke="#92400E"
            strokeWidth="2.2"
          />
          <circle cx="27" cy="50" r="2.6" fill="#451A03" />
          <circle cx="33" cy="51" r="2.6" fill="#451A03" />
          <circle cx="37" cy="48" r="2.6" fill="#451A03" />
          <circle cx="29" cy="45" r="2.4" fill="#451A03" />
        </svg>
      );

    case 'golden_carrot':
    default:
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <circle cx="30" cy="34" r="22" fill="#FEF08A" fillOpacity="0.45" />
          <path
            d="M39 17C43 9 50 8 52 12C54 16 46 21 41 22"
            fill="#38BDF8"
            stroke="#0284C7"
            strokeWidth="2"
          />
          <path
            d="M37 16C36 8 41 5 44 8C47 11 42 17 39 19"
            fill="#7DD3FC"
            stroke="#0284C7"
            strokeWidth="2"
          />
          <path
            d="M28 19C35 15 45 24 42 32C39 40 23 54 16 55C13 55 12 52 13 49C15 41 22 23 28 19Z"
            fill="#FACC15"
            stroke="#B45309"
            strokeWidth="2.5"
          />
          <path d="M27 26L33 29" stroke="#D97706" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M23 35L30 39" stroke="#D97706" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M31 22C34 23 36 26 35 29" stroke="#FEF9C3" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M14 22L16 17L18 22L23 24L18 26L16 31L14 26L9 24L14 22Z" fill="#F59E0B" />
          <path d="M46 38L47.5 34L49 38L53 39.5L49 41L47.5 45L46 41L42 39.5L46 38Z" fill="#F59E0B" />
        </svg>
      );
  }
};

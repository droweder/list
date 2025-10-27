// components/ui/IconPicker.tsx
import React from 'react';

const ICONS = ['🛒', '🍎', '🏠', '🎉', '🎁', '🎂', '💼', '🔨'];

interface IconPickerProps {
  selectedIcon: string;
  onSelectIcon: (icon: string) => void;
}

const IconPicker: React.FC<IconPickerProps> = ({ selectedIcon, onSelectIcon }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Ícone da Lista
      </label>
      <div className="flex flex-wrap gap-2">
        {ICONS.map(icon => (
          <button
            key={icon}
            type="button"
            onClick={() => onSelectIcon(icon)}
            className={`w-12 h-12 text-2xl rounded-lg flex items-center justify-center transition-all duration-200
              ${selectedIcon === icon
                ? 'bg-primary-500 text-white ring-2 ring-offset-2 ring-primary-500'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
          >
            {icon}
          </button>
        ))}
      </div>
    </div>
  );
};

export default IconPicker;

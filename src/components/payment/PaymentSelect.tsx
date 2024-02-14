import React, { ChangeEvent } from "react";

interface Option {
  value: string;
  label: string;
}

interface NativeSelectProps {
  options: Option[];
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  name: string;
}

const NativeSelect: React.FC<NativeSelectProps> = ({ options, value, onChange, name }) => {
  return (
    <div className="relative inline-block w-full">
      <select
        value={value}
        onChange={onChange}
        name={name}
        className="border-gray-400 hover:border-gray-500 focus:shadow-outline block w-full appearance-none rounded border bg-white px-4 py-2 pr-8 leading-tight shadow focus:outline-none"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="text-gray-700 pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 12l-6-6 1.5-1.5L10 9l4.5-4.5L16 6l-6 6z" />
        </svg>
      </div>
    </div>
  );
};

export default NativeSelect;

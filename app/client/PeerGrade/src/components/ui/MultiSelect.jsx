import React from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup } from '@/components/ui/select';

const MultiSelect = ({ options, value, onChange }) => {
  return (
    <Select multiple value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select assignments" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default MultiSelect;
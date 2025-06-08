/* eslint-disable @typescript-eslint/no-explicit-any */
// AutocompleteSelect.tsx
import { FC } from 'react'
import Select, { components } from 'react-select'


const OptionComponent = (props: any) => {
  return (
    <components.Option {...props}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src={props.data.imageUrl}
          alt={props.data.label}
          style={{ width: 30, height: 30, marginRight: 10, borderRadius: 5 }}
        />
        {props.data.label}
      </div>
    </components.Option>
  );
};

type Option = {
  value: string
  label: string
}

type AutocompleteSelectProps = {
  options: Option[]
  value: Option | null
  onChange: (selectedOption: Option | null) => void
  placeholder?: string
  defaultValue?: Option | null
}

const AutocompleteSelect: FC<AutocompleteSelectProps> = ({ options, value, onChange, placeholder, defaultValue }) => {
  return (
    <Select
      className='z-[50]'
      options={options}
      value={value || defaultValue}
      onChange={onChange}
      placeholder={placeholder || 'Select...'}
      isClearable
      isSearchable
      components={{ Option: OptionComponent }}

    />
  )
}

export default AutocompleteSelect

import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Champion {
  name: string;
  role: string;
  description: string;
  title: string;
  imageUrl: string;
}

interface MultiSelectProps {
  options: Champion[];
  placeholder?: string;
  onChange?: (selected: Champion[]) => void;
  label?: string;
}

const MultiSelectChampion: React.FC<MultiSelectProps> = ({ options, placeholder = 'Chọn...', onChange, label }) => {
  const [inputValue, setInputValue] = useState('')
  const [selected, setSelected] = useState<Champion[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const filtered = options.filter(
    (opt) =>
      !selected.find((sel) => sel.name === opt.name) &&
      opt.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleSelect = (value: Champion) => {
    const newSelected = [...selected, value];
    setSelected(newSelected);
    setInputValue('');
    setIsOpen(false);
    onChange?.(newSelected);
  };

  const handleRemove = (name: string) => {
    const newSelected = selected.filter((v) => v.name !== name);
    setSelected(newSelected);
    onChange?.(newSelected);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div>
      <label className='block text-sm font-medium text-gray-700 mb-2'>{label}</label>
      <div className='relative w-full max-w-md' ref={ref}>
        <div
          className="border rounded-xl p-2 flex flex-wrap items-center gap-1 min-h-[48px] cursor-text bg-white"
          onClick={() => setIsOpen(true)}
        >
          {selected.map((champion) => (
            <span
              key={champion.name}
              className="flex items-center bg-blue-100 text-blue-800 text-sm rounded-full px-3 py-1"
            >
              {champion.name}
              <button
                onClick={() => handleRemove(champion.name)}
                className="ml-2 hover:text-red-500"
                type="button"
              >
                <X size={14} />
              </button>
            </span>
          ))}
          <input
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setIsOpen(true);
            }}
            className="flex-1 border-none outline-none p-1"
            placeholder={placeholder}
          />
        </div>
        <AnimatePresence>
          {isOpen && filtered.length > 0 && (
            <motion.ul
              className="absolute z-10 bg-white border rounded-xl mt-1 w-full max-h-60 overflow-y-auto shadow"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {filtered.map((champion) => (
                <li
                  key={champion.name}
                  className="p-2 hover:bg-blue-100 cursor-pointer flex items-center gap-2"
                  onClick={() => handleSelect(champion)}
                >
                  <div>
                    <img className='w-10 h-10 rounded-full' src={champion.imageUrl} alt="" />
                  </div>
                  <div>
                    <div className="font-semibold">{champion.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{champion.title}</div>
                  </div>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MultiSelectChampion;

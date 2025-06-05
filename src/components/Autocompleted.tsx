/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { championApi } from '~/apis/champion.api';

interface Champion {
  id: string;
  name: string;
  role: string;
  description: string;
  title: string;
  imageUrl: string;
}

interface MultiSelectProps {
  placeholder?: string;
  onChange?: (selected: Champion[]) => void;
  label?: string;
  defaultValues?: Champion[];
}

const MultiSelectChampion: React.FC<MultiSelectProps> = ({ placeholder = 'Chọn...', onChange, label, defaultValues = [] }) => {
  const [inputValue, setInputValue] = useState('')
  const [champions, setChampions] = useState<any>([])
  const [selected, setSelected] = useState<Champion[]>(defaultValues)
  useEffect(() => {
    if (typeof defaultValues[0] === 'string') {
      const filtered = champions.filter((item: any) => defaultValues.includes(item.id))
      if (filtered.length > 0) {
        setSelected(filtered)
        onChange?.(filtered)
      }
    }
    if (typeof defaultValues[0] !== 'string' && defaultValues.length > 0) {
      const newData = defaultValues.map((item: any) => {
        return {
          ...item,
          championId: item.championName,
          championName: item.championName,
        }
      })
      setSelected(newData)
      onChange?.(newData)
    }
  }, [defaultValues, champions])
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const filtered = champions.filter(
    (opt: any) =>
      !selected.find((sel) => sel.id === opt.id) &&
      opt.id.toLowerCase().includes(inputValue.toLowerCase())
  );
  useQuery({
    queryKey: ['champions-all', label],
    queryFn: async () => {
      const response = await championApi.getChampions({})
      if (response.data.data) {
        setChampions(response.data.data)
      }
    }
  })
  const handleSelect = (value: Champion) => {
    const newSelected = [...selected, value];
    setSelected(newSelected);
    setInputValue('');
    setIsOpen(false);
    onChange?.(newSelected);
  };

  const handleRemove = (id: string) => {
    const newSelected = selected.filter((v) => v.id !== id);
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
    <div className='z-[50] relative'>
      <label className='block text-sm font-medium text-gray-700 mb-2'>{label}</label>
      <div className=' w-full max-w-md ' ref={ref}>
        <div
          className="border rounded-xl p-2 flex flex-wrap items-center gap-1 min-h-[48px] cursor-text bg-white"
          onClick={() => setIsOpen(true)}
        >
          {selected.map((champion: any) => (
            <span
              key={champion.id || champion.championName}
              className="flex items-center bg-blue-100 text-blue-800 text-sm rounded-full px-3 py-1"
            >
              {champion.id || champion.championName}
              <button
                onClick={() => handleRemove(champion.id || champion.championName)}
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
              className="absolute z-[100] bg-white border rounded-xl mt-1 w-full max-h-60 overflow-y-auto shadow"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {filtered.map((champion: any) => (
                <li
                  key={champion.id || champion.championName}
                  className="p-2 hover:bg-blue-100 cursor-pointer flex items-center gap-2"
                  onClick={() => handleSelect(champion)}
                >
                  <div>
                    <img className='w-10 h-10 rounded-full' src={champion.imageUrl} alt="" />
                  </div>
                  <div>
                    <div className="font-semibold">{champion.id || champion.championName}</div>
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

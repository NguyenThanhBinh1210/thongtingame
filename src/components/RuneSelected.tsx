/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
interface RuneSelectorProps {
  runeData: any[]
  onChange?: (data: any) => void
}
const statShardSlots = [
  ['Adaptive Force', 'Attack Speed', 'Ability Haste'],
  ['Adaptive Force', 'Armor', 'Magic Resist'],
  ['Health', 'Armor', 'Magic Resist']
]

const statShardMap: Record<string, string> = {
  'Adaptive Force': 'Sức Mạnh Thích Ứng',
  'Attack Speed': 'Tốc Độ Đánh',
  'Ability Haste': 'Điểm hồi Kỹ năng',
  Health: 'Máu Tăng Tiến',
  Armor: 'Giáp',
  'Magic Resist': 'Kháng Phép'
}

const RuneSelector = ({ runeData, onChange }: RuneSelectorProps) => {
  const [primary, setPrimary] = useState<any>(null)
  const [secondary, setSecondary] = useState<any>(null)
  const [selectedRunes, setSelectedRunes] = useState<any[]>([])
  const [secondaryRunes, setSecondaryRunes] = useState<any[]>([])
  const [statShards, setStatShards] = useState<(string | null)[]>([null, null, null])

  const handlePrimarySelect = (tree: any) => {
    setPrimary(tree)
    setSelectedRunes([])
    if (secondary?.id === tree.id) setSecondary(null)
  }

  const handleSecondarySelect = (tree: any) => {
    setSecondary(tree)
    setSecondaryRunes([])
  }

  const handleRuneToggle = (rune: any, list: any[], setter: any, max: number) => {
    if (list.find((r) => r.id === rune.id)) {
      setter(list.filter((r) => r.id !== rune.id))
    } else if (list.length < max) {
      setter([...list, rune])
    }
  }

  const handleStatShardSelect = (slotIndex: number, value: string) => {
    const newShards = [...statShards]
    newShards[slotIndex] = value
    setStatShards(newShards)
  }

  const result = {
    primaryTree: primary && {
      name: { en: primary.key, vi: primary.name },
      runes: selectedRunes.map((r) => ({
        en: r.key,
        vi: r.name
      }))
    },
    secondaryTree: secondary && {
      name: { en: secondary.key, vi: secondary.name },
      runes: secondaryRunes.map((r) => ({
        en: r.key,
        vi: r.name
      }))
    },
    statShards: statShards.filter(Boolean).map((s) => ({
      en: s!,
      vi: statShardMap[s!] || s!
    }))
  }
  useEffect(() => {
    if (onChange) {
      onChange(result)
    }
  }, [primary, secondary, selectedRunes, secondaryRunes, statShards])

  return (
    <div className='p-3 space-y-6 border'>
      <h2 className='text-2xl font-bold'>Nhánh chính</h2>
      <div className='flex gap-4 flex-wrap'>
        {runeData.map((tree) => (
          <button
            type='button'
            key={tree.id}
            onClick={() => handlePrimarySelect(tree)}
            className={`border px-3 py-2 rounded ${primary?.id === tree.id ? 'bg-blue-500 text-white' : ''}`}
          >
            {tree.name}
          </button>
        ))}
      </div>

      {primary && (
        <>
          <h3 className='font-semibold'>Chọn 3 ngọc từ {primary.name}</h3>
          <div className='grid grid-cols-3 gap-2'>
            {primary.slots
              .flatMap((slot: any) => slot.runes)
              .map((rune: any) => (
                <button
                  type='button'
                  key={rune.id}
                  onClick={() => handleRuneToggle(rune, selectedRunes, setSelectedRunes, 3)}
                  className={`border px-2 py-1 rounded text-sm ${selectedRunes.find((r) => r.id === rune.id) ? 'bg-green-500 text-white' : ''
                    }`}
                >
                  {rune.name}
                </button>
              ))}
          </div>
        </>
      )}

      <h2 className='text-2xl font-bold'>Nhánh phụ</h2>
      <div className='flex gap-4 flex-wrap'>
        {runeData
          .filter((tree) => tree.id !== primary?.id)
          .map((tree) => (
            <button
              type='button'
              key={tree.id}
              onClick={() => handleSecondarySelect(tree)}
              className={`border px-3 py-2 rounded ${secondary?.id === tree.id ? 'bg-purple-500 text-white' : ''}`}
            >
              {tree.name}
            </button>
          ))}
      </div>

      {secondary && (
        <>
          <h3 className='font-semibold'>Chọn 2 ngọc từ {secondary.name}</h3>
          <div className='grid grid-cols-3 gap-2'>
            {secondary.slots
              .flatMap((slot: any) => slot.runes)
              .map((rune: any) => (
                <button
                  type='button'
                  key={rune.id}
                  onClick={() => handleRuneToggle(rune, secondaryRunes, setSecondaryRunes, 2)}
                  className={`border px-2 py-1 rounded text-sm ${secondaryRunes.find((r) => r.id === rune.id) ? 'bg-yellow-500 text-black' : ''
                    }`}
                >
                  {rune.name}
                </button>
              ))}
          </div>
        </>
      )}

      <h2 className='text-2xl font-bold'>Ngọc khuyến nghị</h2>
      <div className='space-y-4'>
        {statShardSlots.map((options, index) => (
          <div key={index} className='flex gap-2'>
            {options.map((option) => (
              <button
                key={option}
                type='button'
                onClick={() => handleStatShardSelect(index, option)}
                className={`border px-2 py-1 rounded text-sm ${statShards[index] === option ? 'bg-red-500 text-white' : ''
                  }`}
              >
                {statShardMap[option]}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* <h2 className='text-2xl font-bold'>Kết quả JSON</h2>
      <pre className='bg-gray-900 text-white p-4 rounded max-h-[400px] overflow-auto text-sm'>
        {JSON.stringify(result, null, 2)}
      </pre> */}
    </div>
  )
}

export default RuneSelector

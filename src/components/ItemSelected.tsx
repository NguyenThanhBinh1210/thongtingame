/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import axios from 'axios'
import Select from 'react-select'
import { Button } from '@nextui-org/react'

const ItemBuildComponent = ({ langSelected, onChange }: { langSelected: string; onChange: (data: any) => void }) => {
  const [itemsData, setItemsData] = useState<any[]>([])
  const [categorizedItems, setCategorizedItems] = useState<{ starter: any[]; boots: any[]; legendary: any[] }>({
    starter: [],
    boots: [],
    legendary: []
  })
  const [selectedStarter, setSelectedStarter] = useState<any[]>([])
  const [selectedBoots, setSelectedBoots] = useState<any[]>([])
  const [selectedCoreBuilds, setSelectedCoreBuilds] = useState<any[]>([])
  const [selectedFourthItems, setSelectedFourthItems] = useState<any[]>([])
  const [selectedFifthItems, setSelectedFifthItems] = useState<any[]>([])
  const [selectedSixthItems, setSelectedSixthItems] = useState<any[]>([])
  useEffect(() => {
    const fetchItems = async () => {
      const res = await axios.get(
        `https://ddragon.leagueoflegends.com/cdn/14.11.1/data/${langSelected === 'vi' ? 'vi_VN' : 'en_US'}/item.json`
      )
      const itemObj = res.data.data
      const itemsArr = Object.entries(itemObj).map(([id, data]: any) => ({
        id,
        name: data.name,
        tags: data.tags || [],
        gold: data.gold?.total || 0,
        depth: data.depth || 1
      }))

      setItemsData(itemsArr)

      const starter = itemsArr.filter((item) => item.tags.includes('Starter') || item.gold <= 500)
      const boots = itemsArr.filter((item) => item.tags.includes('Boots'))
      const legendary = itemsArr.filter((item) => item.depth >= 3 || item.gold >= 2600)

      setCategorizedItems({ starter, boots, legendary })
    }

    fetchItems()
  }, [langSelected])

  const mapToOptions = (items: any) => items.map((item: any) => ({ value: item.id, label: item.name }))

  const getName = (id: any) => itemsData.find((item: any) => item.id === id)?.name || id

  const generateFinalData = () => {
    const data = [
      {
        startingItems: selectedStarter.length
          ? [
            {
              items: selectedStarter.map(getName),
              pickRate: '0%',
              winRate: '0%'
            }
          ]
          : [],
        boots: selectedBoots.map((id) => ({
          name: getName(id),
          pickRate: '0%',
          winRate: '0%'
        })),
        coreBuilds: selectedCoreBuilds.length
          ? [
            {
              items: selectedCoreBuilds.map(getName),
              pickRate: '0%',
              winRate: '0%'
            }
          ]
          : [],
        situational: {
          fourthItems: selectedFourthItems.map((id) => ({
            name: getName(id),
            winRate: '0%',
            matches: '0'
          })),
          fifthItems: selectedFifthItems.map((id) => ({
            name: getName(id),
            winRate: '0%',
            matches: '0'
          })),
          sixthItems: selectedSixthItems.map((id) => ({
            name: getName(id),
            winRate: '0%',
            matches: '0'
          }))
        }
      }
    ]
    if (onChange) {
      onChange(data)
    }
  }

  return (
    <div className='p-4 space-y-6 border'>
      <h2 className='text-xl font-bold'>Chọn trang bị</h2>

      <div>
        <h3 className='font-semibold mb-1'>Khởi đầu</h3>
        <Select
          options={mapToOptions(categorizedItems.starter)}
          isMulti
          onChange={(opts: any) => setSelectedStarter(opts.map((opt: any) => opt.value))}
          className='mb-4'
          placeholder='Chọn trang bị khởi đầu...'
        />
      </div>

      <div>
        <h3 className='font-semibold mb-1'>Giày</h3>
        <Select
          options={mapToOptions(categorizedItems.boots)}
          isMulti
          onChange={(opts: any) => setSelectedBoots(opts.map((opt: any) => opt.value))}
          className='mb-4'
          placeholder='Chọn giày...'
        />
      </div>

      <div>
        <h3 className='font-semibold mb-1'>Trang bị trấn</h3>
        <Select
          options={mapToOptions(categorizedItems.legendary)}
          isMulti
          onChange={(opts: any) => setSelectedCoreBuilds(opts.map((opt: any) => opt.value))}
          className='mb-4'
          placeholder='Chọn trang trấn...'
        />
      </div>

      <div>
        <h3 className='font-semibold mb-1'>Trang bị 4</h3>
        <Select
          options={mapToOptions(categorizedItems.legendary)}
          isMulti
          onChange={(opts: any) => setSelectedFourthItems(opts.map((opt: any) => opt.value))}
          className='mb-4'
          placeholder='Chọn trang bị 4...'
        />
      </div>

      <div>
        <h3 className='font-semibold mb-1'>Trang bị 5</h3>
        <Select
          options={mapToOptions(categorizedItems.legendary)}
          isMulti
          onChange={(opts: any) => setSelectedFifthItems(opts.map((opt: any) => opt.value))}
          className='mb-4'
          placeholder='Chọn trang bị 5...'
        />
      </div>

      <div>
        <h3 className='font-semibold mb-1'>Trang bị cuối</h3>
        <Select
          options={mapToOptions(categorizedItems.legendary)}
          isMulti
          onChange={(opts: any) => setSelectedSixthItems(opts.map((opt: any) => opt.value))}
          className='mb-4'
          placeholder='Chọn trang bị cuối...'
        />
      </div>

      <Button className='bg-blue-500 text-white px-4 py-2 rounded' onClick={generateFinalData}>
        Xác nhận
      </Button>
      <p className='text-sm text-gray-500'>
        Bấm xác nhận để lưu lại các trang bị đã chọn!
      </p>
    </div>
  )
}

export default ItemBuildComponent

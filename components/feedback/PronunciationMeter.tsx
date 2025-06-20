export default function PronunciationMeter({ confidence }: { confidence: number }) {
  const percentage = Math.round(confidence * 100)
  
  const getColor = (percent: number) => {
    if (percent < 33) return 'bg-red-500'
    if (percent < 66) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <div className="space-y-1">
      <div className="text-sm text-gray-600">Pronunciation: {percentage}%</div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`${getColor(percentage)} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
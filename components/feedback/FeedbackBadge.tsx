import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid'

type FeedbackType = 'correct' | 'incorrect' | 'partial'

export default function FeedbackBadge({ type }: { type: FeedbackType }) {
  const feedbackConfig = {
    correct: {
      icon: CheckCircleIcon,
      color: 'text-green-500',
      bgColor: 'bg-green-100',
      text: 'Correct!'
    },
    incorrect: {
      icon: XCircleIcon,
      color: 'text-red-500',
      bgColor: 'bg-red-100',
      text: 'Needs work'
    },
    partial: {
      icon: ExclamationTriangleIcon,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100',
      text: 'Almost there'
    }
  }

  const { icon: Icon, color, bgColor, text } = feedbackConfig[type]

  return (
    <div className={`${bgColor} p-2 rounded-lg flex items-center gap-2`}>
      <Icon className={`w-5 h-5 ${color}`} />
      <span className={`${color} font-medium`}>{text}</span>
    </div>
  )
}
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'

interface WeatherData {
  temperature: number
  condition: string
  city: string
  description: string
  icon: string
}

interface WeatherWidgetProps {
  weatherData?: WeatherData
}

export default function WeatherWidget({ weatherData }: WeatherWidgetProps) {
  const { t } = useTranslation()

  const defaultWeather: WeatherData = {
    temperature: 28,
    condition: t('dashboard.weather.partlySunny'),
    city: t('dashboard.weather.cairo'),
    description: t('dashboard.weather.perfectForOutdoor'),
    icon: 'sun',
  }

  const weather = weatherData || defaultWeather

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return ['fas', 'sun']
      case 'partly sunny':
      case 'partly cloudy':
        return ['fas', 'cloud-sun']
      case 'cloudy':
        return ['fas', 'cloud']
      case 'rain':
      case 'rainy':
        return ['fas', 'cloud-rain']
      case 'storm':
        return ['fas', 'cloud-bolt']
      default:
        return ['fas', 'sun']
    }
  }

  return (
    <div className="bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-900 dark:to-blue-800 text-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <FontAwesomeIcon
            icon={['fas', 'cloud-sun']}
            className="text-yellow-300"
          />
          {t('dashboard.weather.title')}
        </h3>
        <div className="text-right">
          <div className="text-2xl font-bold">{weather.temperature}°C</div>
          <div className="text-sm opacity-80">{weather.city}</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">{weather.condition}</div>
          <div className="text-sm opacity-80">{weather.description}</div>
        </div>
        <FontAwesomeIcon
          icon={getWeatherIcon(weather.condition) as any}
          className="text-3xl text-yellow-300"
        />
      </div>
    </div>
  )
}

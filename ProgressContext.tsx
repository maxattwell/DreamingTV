import {
  createContext,
  useContext as useReactContext,
  useEffect,
  useState
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type TVideo = {
  title: string
  watchedSeconds: number
}

interface ContextType {
  token: string | null
  handleSetToken: (token: string | null) => void
  handleRemoveToken: () => void
  goalMinutes: string
  currentMinutes: string
  goalReached: boolean
  setGoalMinutes: (value: string) => void
  setCurrentMinutes: (value: string) => void
  setGoalReached: (value: boolean) => void
  videos: TVideo[]
  addHours: (title: string, duration: number) => Promise<boolean>
  refreshProgress: () => Promise<void>
}

const Context = createContext<ContextType | undefined>(undefined)

export function ContextProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)

  const timezone = -new Date().getTimezoneOffset() / 60
  const dateString = new Date().toLocaleDateString('en-CA')

  const [goalMinutes, setGoalMinutes] = useState('60')
  const [currentMinutes, setCurrentMinutes] = useState('0')
  const [goalReached, setGoalReached] = useState(false)
  const [videos, setVideos] = useState<TVideo[]>([])

  useEffect(() => {
    const loadStoredData = async () => {
      const storedToken = await AsyncStorage.getItem('token')
      const storedGoalMinutes = await AsyncStorage.getItem('goalMinutes')
      const storedDateString = await AsyncStorage.getItem('dateString')
      const storedCurrentMinutes = await AsyncStorage.getItem('currentMinutes')
      const storedGoalReached = await AsyncStorage.getItem('goalReached')

      setToken(storedToken)
      setGoalMinutes(storedGoalMinutes ?? '60')
      
      if (storedDateString === dateString) {
        setCurrentMinutes(storedCurrentMinutes || '0')
        setGoalReached(storedGoalReached === 'true')
      } else {
        setCurrentMinutes('0')
        setGoalReached(false)
      }
    }

    loadStoredData()
  }, [dateString])

  const handleSetToken = async (token: string | null) => {
    await AsyncStorage.setItem('token', token || '')
    setToken(token)
  }

  const handleRemoveToken = async () => {
    await AsyncStorage.removeItem('token')
    setToken(null)
  }

  const getDayWatchedTime = async () => {
    try {
      const response = await fetch(
        `https://www.dreamingspanish.com/.netlify/functions/dayWatchedTime?date=${dateString}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      )
      const data = await response.json()
      console.log(data, response)
      return data
        ? {
            goalReached: data.dayWatchedTime.goalReached,
            timeSeconds: data.dayWatchedTime.timeSeconds
          }
        : null
    } catch (error) {
      console.error('Error fetching day watched time:', error)
      return null
    }
  }

  const getUser = async () => {
    try {
      const response = await fetch(
        `https://www.dreamingspanish.com/.netlify/functions/user?timezone=${timezone}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      )
      const data = await response.json()
      return data?.user
        ? { dailyGoalSeconds: data.user.dailyGoalSeconds }
        : null
    } catch (error) {
      console.error('Error fetching user data:', error)
      return null
    }
  }

  function generateUniqueId() {
    const timestamp = Date.now()
    const randomComponent = Math.random()
    const uniqueId = `${timestamp}${randomComponent}`
    return uniqueId
  }

  async function addHours(title: string, duration: number) {
    const body = {
      date: new Date().toLocaleString('en-CA').split(',')[0],
      description: `${title} -- Logged by DreamingTV`,
      id: generateUniqueId(),
      timeSeconds: duration,
      type: 'watching'
    }

    try {
      await fetch(
        'https://www.dreamingspanish.com/.netlify/functions/externalTime',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(body)
        }
      )

      const newCurrentMinutes = String(
        Number(currentMinutes) + Math.floor(duration / 60)
      )
      setCurrentMinutes(newCurrentMinutes)
      await AsyncStorage.setItem('currentMinutes', newCurrentMinutes)

      if (Number(newCurrentMinutes) >= Number(goalMinutes)) {
        setGoalReached(true)
        await AsyncStorage.setItem('goalReached', 'true')
      }

      return true
    } catch (error) {
      console.error('Error adding time:', error)
    }
    return false
  }

  const fetchProgressData = async () => {
    const dayData = await getDayWatchedTime()
    const userData = await getUser()

    if (dayData && userData) {
      const currentMins = String(Math.floor(dayData.timeSeconds / 60))
      const goalMins = String(Math.floor(userData.dailyGoalSeconds / 60))
      
      setCurrentMinutes(currentMins)
      setGoalMinutes(goalMins)
      setGoalReached(dayData.goalReached)

      await AsyncStorage.setItem('currentMinutes', currentMins)
      await AsyncStorage.setItem('goalMinutes', goalMins)
      await AsyncStorage.setItem('goalReached', dayData.goalReached.toString())
      await AsyncStorage.setItem('dateString', dateString)
    }
  }

  useEffect(() => {
    if (token) {
      fetchProgressData()
    }
  }, [token])

  return (
    <Context.Provider
      value={{
        token,
        handleSetToken,
        handleRemoveToken,
        goalMinutes,
        currentMinutes,
        goalReached,
        setGoalMinutes,
        setCurrentMinutes,
        setGoalReached,
        videos,
        addHours,
        refreshProgress: fetchProgressData
      }}
    >
      {children}
    </Context.Provider>
  )
}

export function useContext() {
  const context = useReactContext(Context)
  if (!context)
    throw new Error('useContext must be used within a ContextProvider')
  return context
}

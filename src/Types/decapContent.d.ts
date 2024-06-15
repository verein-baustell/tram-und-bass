type Line = {
  name: string
  number: number
  id: string
  releaseDate: string
  color: string
  isInverted: boolean
  videoUrl: string
  artistName: string
  artistAboutText: string
  timeStamps: TimeStamp[]
  }
  
type TimeStamp = {
    name: string
    startTime: number 
    endTime: number 
  }
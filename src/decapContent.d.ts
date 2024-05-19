type DecapCMSLine = {
    timeStamps: TimeStamp[]
    name: string
    number: number
    color: string
    isInverted: boolean
    videoUrl: string
    artistName: string
    artistAboutText: string
  }
  
type TimeStamp = {
    name: string
    startTime: string
    endTime: string
  }
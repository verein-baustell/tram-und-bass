type City = {
    name: string
    slug: string
    legal: string
    description: string
    lines: Line[]
}

type Line = {
  name: string
  number: number
  id: string
  releaseDate: string
  isReleased: boolean
  color: string
  isInverted: boolean
  videoUrl: string
  artistName: string
  artistAboutText: string
  timeStamps?: TimeStamp[]
  }
  
type TimeStamp = {
    name: string
    startTime: string 
    endTime: string 
  }
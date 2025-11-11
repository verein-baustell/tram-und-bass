type City = {
    name: string;
    slug: string;
    released: boolean;
    lat: number;
    lng: number;
    color: string;
    legal: string;
    description: string;
    lines: Line[];
    map?: string; // SVG content as string
};

type Line = {
    name: string;
    number: number;
    id: string;
    releaseDate: string;
    isReleased: boolean;
    color: string;
    isInverted: boolean;
    videoUrl: string;
    artistName: string;
    artistAboutText: string;
    timeStamps?: TimeStamp[];
};

type TimeStamp = {
    name: string;
    startTime: string;
    endTime: string;
};

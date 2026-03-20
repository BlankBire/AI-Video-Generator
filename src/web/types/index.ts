export type ResolutionType = '720p' | '1080p';
export type AspectRatioType = '9:16' | '16:9' | '1:1';
export type DurationType = '15s' | '30s' | '60s';

export interface VideoConfigState {
  resolution: ResolutionType;
  aspectRatio: AspectRatioType;
  duration: DurationType;
  activeStyle: string;
  activeTone: string;
  emotion: string;
  motionIntensity: number;
  transitions: boolean;
  charConsistency: boolean;
}

export interface AudioConfigState {
  voiceGender: string;
  language: string;
  voiceSpeed: number;
  bgMusic: boolean;
}

export interface ContentState {
  foodTopic: string;
  mainCharacter: string;
  script: string;
}

import { ActivityTypes } from 'src/app/globals';
import { ParticipantCode } from './activities';

export interface Timer {
  id: number;
  status: string;
  start_time: string;
  end_time: string;
  remaining_seconds: number;
  total_seconds: number;
}

export interface MCQChoice {
  id: number;
  choice_text: string;
  order: number;
  is_correct: boolean;
  explanation: string;
}

export interface MCQQuestion {
  id: number;
  question: string;
  mcqchoice_set: MCQChoice[];
}

export interface FeedbackQuestion {
  id: number;
  question_type: string;
  question_text: string;
  is_combo: boolean;
  combo_text?: string;
}

//
// Build a pitch intefaces

export interface BuildAPitchBlank {
  id: number;
  order: number;
  label: string;
  temp_text: string;
  help_text: string;
}

export interface BuildAPitchEntry {
  buildapitchblank: number;
  value: string;
}

export interface BuildAPitchPitch {
  participant: ParticipantCode;
  buildapitchentry_set: Array<BuildAPitchEntry>;
  votes: number;
}

export interface TitleComponent {
  participant_instructions: string;
  screen_instructions: string;
  title: string;
  title_image: string;
}

export type ScreenType = 'mainScreen' | 'participantScreen';

export interface PreviewActivity {
  activity_type: ActivityTypes;
  content: any;
  screenType: ScreenType;
}

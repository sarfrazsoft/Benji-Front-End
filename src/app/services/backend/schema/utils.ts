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
}

//
// Build a pitch intefaces

export interface BuildAPitchBlank {
  id: Number;
  order: Number;
  label: string;
  temp_text: string;
  help_text: string;
}

export interface BuildAPitchEntry {
  buildapitchblank: Number;
  value: string;
}

export interface BuildAPitchPitch {
  user: Number;
  buildapitchentry_set: Array<BuildAPitchEntry>;
}

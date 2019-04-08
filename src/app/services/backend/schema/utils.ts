
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

export interface FeedbackChoice {
  id: number;
  choice_text: string;
}

export interface FeedbackQuestion {
  id: number;
  question_type: string;
  question_text: string;
  rating_min: number;
  rating_max: number;
  feedbackchoice_set: FeedbackChoice[];
}

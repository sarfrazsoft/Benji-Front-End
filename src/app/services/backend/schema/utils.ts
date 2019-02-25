
export interface Timer {
  status: string;
  start_time: string;
  expiration_time: string;
  remaining_seconds: string;
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


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

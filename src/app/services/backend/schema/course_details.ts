import { User } from './user';

export interface PaginatedResponse<T> {
  count: number;
  next: string;
  previous: string;
  results: Array<T>;
}

export interface Course {
  id: number;
  course_name: string;
  course_description: string;
  course_id: number;
}

export class Lesson {
  id?: number;
  lesson_id?: string;
  lesson_name: string;
  single_user_lesson?: boolean;
  lesson_length_minutes?: number;
  lesson_description?: string;
  lesson_plan?: string;
  lesson_plan_json?: Array<any>;
  lesson_details?: any;
  standardize?: boolean;
  owner?: number;
  team?: number;
  editor_lesson_plan?: any;
  team_permission?: string;
  public_permission?: string;
  creation_time?: string;
  last_edited?: string;
  is_shared?: boolean;
  effective_permission?: string; // 'admin', 'host', 'duplicate' 'edit', or null
}

export interface LessonRun {
  id: number;
  start_time: string;
  end_time: string;
  lessonrun_code: number;
  participant_set: Array<Participant>;
}

export interface LessonRunDetails {
  end_time: string;
  host: any;
  id: number;
  lesson: any;
  lessonrun_code: number;
  participant_set: Array<any>;
  start_time: string;
}

export interface Participant {
  display_name: string;
  email: string;
  lessonrun_code: number;
  user: any;
  is_active: boolean;
  socket_link: string;
  participant_code: number;
}

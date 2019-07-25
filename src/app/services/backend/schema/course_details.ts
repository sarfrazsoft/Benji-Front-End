import { User } from './user';

export interface PaginatedResponse<T> {
  count: Number;
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

export interface Lesson {
  id: number;
  course: number;
  lesson_id: string;
  lesson_name: string;
  lesson_length_minutes: number;
  lesson_description: string;
  next_lesson: number;
}

export interface LessonRun {
  id: number;
  start_time: string;
  end_time: string;
  lessonrun_code: number;
  joined_users: User[];
}

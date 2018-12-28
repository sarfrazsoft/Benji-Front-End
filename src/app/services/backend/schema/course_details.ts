
export interface Course {
  id: number;
  course_name: string;
  course_creator: string;
  course_sponsor: string;
}


export interface Lesson {
  id: number;
  course: Course;
  lesson_id: string;
  lesson_name: string;
  lesson_length: number;
  lesson_description: string;
  next_lesson: number;
}

export interface CourseRun {
  id: number;
  course: Course;
  start_time: string;
  end_time: string;
}


export interface LessonRun {
  id: number;
  lesson: number;
  lessonrun_code: number;
  courserun: number;
  start_time: string;
  end_time: string;

}

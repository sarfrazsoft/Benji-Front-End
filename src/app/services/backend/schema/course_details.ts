import { Time } from '@angular/common';
import { Branding, TeamUser, User } from './user';
import { Timer } from './utils';

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

export type EffectivePermission = 'admin' | 'host' | 'duplicate' | 'edit' | null;

export class Lesson {
  id?: number;
  lesson_id?: string;
  lesson_name?: string;
  single_user_lesson?: boolean;
  lesson_length_minutes?: number;
  lesson_description?: string;
  lesson_folders?: Array<number>;
  lesson_long_description?: string;
  lesson_plan?: string;
  lesson_plan_json?: Array<any>;
  lesson_details?: any;
  standardize?: boolean;
  owner?: number;
  team?: number;
  editor_lesson_plan?: Array<any>;
  editor_lesson_plan_errors?: any;
  team_permission?: string;
  public_permission?: string;
  creation_time?: string;
  last_edited?: string;
  is_shared?: boolean;
  effective_permission?: EffectivePermission;
  is_valid_lesson?: boolean;
  feature_image?: string;
  is_deleted?: boolean;
  is_default?: boolean;
  status?: string;
}


export interface LessonRun {
  id: number;
  start_time: string;
  end_time: string;
  lessonrun_code: number;
  host: any;
  participant_set: Array<Participant>;
  branding: Branding;
  lesson: Lesson;
  lessonrun_images: Array<CoverPhoto>;
}

export interface CoverPhoto {
  id: number;
  image_url: string;
  img: string;
}

export interface RunningTools {
  share?: {
    selectedParticipant: number;
    volunteers: Array<number>;
    convoCard: { selectedCard: number };
    feedback: {
      sharing_participant: number;
      participants: [{ participant: number; text: string; reaction: string }];
    };
  };
  grouping_tool?: GroupingTool;
  timer_tool?: Timer;
}
export interface GroupingTool {
  selectedGrouping: number;
  groupings: Array<GroupingToolGroups>;
  viewGrouping: boolean;
}
export interface GroupingToolGroups {
  id: number;
  title: string;
  allowParticipantsJoining: boolean;
  allowParticipantsJoiningMidActivity: boolean;
  unassignedParticipants: Array<number>;
  groups: Array<Group>;
  style: 'hostAssigned' | 'selfAssigned';
  assignedActivities: Array<string>;
}
export interface Group {
  id: number;
  title: string;
  description: string;
  participants: Array<number>;
}

export interface BeforeLessonRunDetails {
  host: string;
  description: string;
  participants: Array<any>;
  title: string;
}

export interface LessonRunDetails {
  end_time: string;
  host: TeamUser;
  id: number;
  lesson: Lesson;
  lessonrun_code: number;
  participant_set: Array<any>;
  screen_socet: string;
  start_time: string;
  branding: Branding;
  idea_count: number;
  board_count: number;
  lessonrun_images: Array<CoverPhoto>;
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

export interface SessionInformation {
  id: number;
  lessonrun_code: number;
  screen_socket: string;
  theme_label: null;
  start_time: string;
  end_time: null;
  is_facilitator_active: true;
  lesson: number;
  host: number;
  theme: null;
  current_activity: null;
}

export interface Folder {
  id: number;
  name: string;
  lesson: Array<any>;
  created_by: number;
  creation_time: String;
  selected: boolean;
}
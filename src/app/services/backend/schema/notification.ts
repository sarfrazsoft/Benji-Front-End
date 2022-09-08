export interface NotificationResult {
  count: number;
  next: number;
  previous: number;
  results: Array<Notification>;
}

export interface Notification {
  actor_content_type: any;
  actor_object_id: any;
  actor_text: any;
  actor_url_text: any;
  created: string;
  deleted: boolean;
  description: string;
  extra: NotificationExtra;
  id: number;
  nf_type: string;
  obj_content_type: any;
  obj_object_id: any;
  obj_text: any;
  obj_url_text: any;
  read: boolean;
  recipient: number;
  target_content_type: any;
  target_object_id: any;
  target_text: any;
  target_url_text: any;
  verb: string;
}

export interface NotificationExtra {
  action: string;
  brainstormcategory: number;
  board_id: number;
  comment: string;
  extra: string;
  idea: number;
  idea_id: number;
  lessonrun_code: number;
  name: string;
  lesson_name: string;
}

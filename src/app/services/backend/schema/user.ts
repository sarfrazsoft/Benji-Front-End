export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  verified_email: boolean;
  job_title: string;
  organization_name: string;
  orggroup_name: string;
  organization: number;
  orggroup: number;
  local_admin_permission: boolean;
  participant_permission: boolean;
}

export interface Users {
  count: number;
  next: any;
  previous: any;
  results: Array<User>;
}

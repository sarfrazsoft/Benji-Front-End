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
  branding: Branding;
}

export interface Branding {
  id: number;
  user: number;
  logo: File;
  favicon: File;
  color: string;
}

export interface TeamUser {
  effective_permissions?: Array<any>;
  email: string;
  first_name: string;
  id: number;
  last_name: string;
  licenses?: Array<any>;
  teammembership_set?: Array<{ membership_type: string; team: Team }>;
  username: string;
  verified_email?: boolean;
  branding: Branding;
}

export interface Team {
  id: number;
  name: string;
  permissions: Array<any>;
  teammembership_set: Array<{ benjiuser: TeamUser; id: number; membershit_type: string }>;
  emailed_invites: Array<any>;
  invited_users: Array<any>;
}

export interface Users {
  count: number;
  next: any;
  previous: any;
  results: Array<User>;
}

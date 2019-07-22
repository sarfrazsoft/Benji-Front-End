export interface UserInvitation {
  id: number;
  created_at: string;
  last_email_sent_at: string;
  num_emails: string;
  accepted: string;
  email: string;
  suggested_first_name: string;
  suggested_last_name: string;
  organization: number;
  inviter: string;
  suggested_orggroup: number;
}

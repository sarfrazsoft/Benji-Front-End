import { CommonField } from './shared';

export interface LobbyActivity {
  activity_id: CommonField;
  description: CommonField;
  next_activity_delay_seconds: CommonField;
  auto_next: CommonField;
  lobby_text: CommonField;
}

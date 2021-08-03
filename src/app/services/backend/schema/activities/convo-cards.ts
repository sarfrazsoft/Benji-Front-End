import { ParentActivity } from './activities';

export interface ConvoCardsActivity extends ParentActivity {
  title_image: string;
  title_text: string;
  main_title: string;
  cards: Array<Card>;
  participant_cards: { number: Array<number> };
  deal_number: number;
}

export interface Card {
  card_image: string;
  card_title: string;
  card_text: string;
  id: number;
}

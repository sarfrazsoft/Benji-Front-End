import { ParentActivity } from './activities';

export interface ConvoCardsActivity extends ParentActivity {
  title_image: string;
  title_text: string;
  main_title: string;
  cards: Array<Card>;
}

export interface Card {
  card_image: string;
  card_title: string;
  card_text: string;
}

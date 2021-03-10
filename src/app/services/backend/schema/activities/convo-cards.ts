import { ParentActivity } from './activities';

export interface ConvoCardsActivity extends ParentActivity {
  title_image: string;
  title_text: string;
  cards: Array<Card>;
}

export interface Card {
  title_image: string;
  main_title: string;
  title_text: string;
}

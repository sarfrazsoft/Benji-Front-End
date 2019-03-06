import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmojiLookupService {

  constructor() { }

  public getEmoji(string) {
    switch (string) {
      case 'speech':
        return '💬';
      case 'ghost':
        return '👻';
      case 'zipface':
        return '🤐';
      case 'haloface':
        return '😇';
      case 'thinkingface':
        return '🤔';
      case 'horn':
        return '📣';
      case 'ear':
        return '👂';
      case 'leftrightarrow':
        return '⟷';
      default:
        console.log('Emoji Service: The emoji string is not assigned!');
    }
  }
}

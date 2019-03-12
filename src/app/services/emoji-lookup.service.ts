import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmojiLookupService {
  constructor() {}

  public getEmoji(string) {
    string = string.split('//')[1];
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
        return '↔️';
      case 'cat':
        return '🐈';
      case 'dog':
        return '🐕';
      case 'burger':
        return '🍔';
      case 'hotdog':
        return '🌭';
      default:
        console.log('Emoji Service: The emoji string is not assigned!');
    }
  }
}

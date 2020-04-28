import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
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
      case 'rocket':
        return '🚀';
      case 'dinosaur':
        return '🦕';
      case 'world':
        return '🌎';
      case 'penguin':
        return '🐧';
      case 'mic':
        return '👩‍🎤';
      case 'woman-cross':
        return '🙅‍♀️';
      case 'party-poppers':
        return '🎉';
      case 'avocado':
        return '🥑';
      case 'banana':
        return '🍌';
      case 'speakinghead':
        return '🗣️';
      case 'grimacing':
        return '😬';
      case 'raisinghand':
        return '🙋‍♀️';
      case 'weary':
        return '😩';
      case 'handshake':
        return '🤝';
      case 'womanfacepalming':
        return '🤦‍♀️';
      case 'womandancing':
        return '💃🏽';
      case 'wave':
        return '👋';
      case 'explodinghead':
        return '🤯';
      case 'observer':
        return '👨‍💻';
      case 'observerbrownskin':
        return '👨🏽‍💻';
      case 'customer':
        return '🙅‍♂️';
      case 'sales':
        return '👩‍💼';
      case 'darkskinofficeworker':
        return '👩🏾‍💼';
      case 'videocamera':
        return '📽️';
      case 'lightbulb':
        return '💡';
      case 'cowboy':
        return '🤠';
      case 'billiards':
        return '🎱';
      case 'hearteyes':
        return '😍';
      case 'sunglasses':
        return '😎';
      case 'confusedface':
        return '😕';
      case 'brain':
        return '🧠';
      case 'nerdface':
        return '🤓';
      case 'pausebutton':
        return '⏸️';
      case 'fastreversebutton':
        return '⏪';
      case 'oldmandarkskin':
        return '👴🏿';
      case 'babylightskin':
        return '👶🏻';
      default:
        console.log('Emoji Service: The emoji string is not assigned!');
    }
  }
}

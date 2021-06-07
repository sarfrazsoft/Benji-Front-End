import { browser, by, element, ElementHelper } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('https://app.mybenji.com/participant/join');
    // return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('app-root h1')).getText();
  }

  getWelcomeText() {
    return element(by.id('hurr')).getText();
  }

  injectRoomCode(e: ElementHelper, roomCode) {
    return e(by.id('room-code')).sendKeys(roomCode);
  }

  injectparticipantName(e: ElementHelper, name: string) {
    return e(by.id('participant-name')).sendKeys(name);
  }

  clickEnter(e: ElementHelper) {
    return e(by.tagName('button')).click();
  }
}

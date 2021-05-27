import { browser, ProtractorBrowser } from 'protractor';
import { AppPage } from './app.po';

describe('workspace-project App', () => {
  let page: AppPage;
  const names = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    'aa',
    'ab',
    'ac',
    'ad',
    'ae',
    'af',
    'ag',
    'ah',
    'ai',
    'aj',
    'ak',
  ];

  beforeEach(() => {
    page = new AppPage();
  });

  it(`should enter room code in correct field,
  wait for room code to get validated and
  then click enter and verfiy if it is in lobby screen`, () => {
    page.navigateTo();
    const browsers: Array<ProtractorBrowser> = [];
    const n = 30;
    for (let i = 0; i < n; i++) {
      browsers.push(browser.forkNewDriverInstance(true));
    }
    for (let i = 0; i < n; i++) {
      page.injectRoomCode(browsers[i].element, '45344');
    }
    browser.sleep(2000);
    for (let i = 0; i < n; i++) {
      page.injectparticipantName(browsers[i].element, names[i]);
    }
    for (let i = 0; i < n; i++) {
      page.clickEnter(browsers[i].element);
    }

    browser.sleep(4000000);
  });
});

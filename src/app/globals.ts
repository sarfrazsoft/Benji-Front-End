'use strict';

import { environment } from './../environments/environment';

const backend = environment.host;
const web_protocol = environment.web_protocol;
const socket_protocl = environment.socket_protocl;

export const apiRoot = web_protocol + '://' + backend + '/api';
export const wsRoot = socket_protocl + '://' + backend;

export enum ActivityTypes {
  brainStorm = 'BrainstormActivity',
  gather = 'GatherActivity',
  pitchoMatic = 'PitchoMaticActivity',
  buildAPitch = 'BuildAPitchActivity',
  caseStudy = 'CaseStudyActivity',
  externalGrouping = 'ExternalGroupingActivity',
  lobby = 'LobbyActivity',
  title = 'TitleActivity',
  mcq = 'MCQActivity',
  mcqResults = 'MCQResultsActivity',
  teleTrivia = 'TeleTriviaActivity',
  whereDoYouStand = 'WhereDoYouStandActivity',
  video = 'VideoActivity',
  pairGrouping = 'PairGroupingActivity',
  rolePlayPair = 'RoleplayPairActivity',
  discussion = 'DiscussionActivity',
  feedback = 'FeedbackActivity',
  hintWord = 'HintWordActivity',
  genericRoleplay = 'GenericRoleplayActivity',
  triadGrouping = 'TriadGroupingActivity',
}
// export type MeasurementTimeframe = 'alltime' | 'year' | 'month' | 'week' | 'day';

export const DefaultwhiteLabelInfo = {
  // name: 'Refound',
  // welcome_text: 'Welcome to the Accountability Dial!',
  // link: 'http://Refound.com',
  // logo: './assets/img/refound_logo.png',
  // favicon: './assets/img/refound_favicon.png',
  // parameters: {
  //   lightLogo: './assets/img/refound_logo.png',
  //   darkLogo: './assets/img/refound_logo.png',
  //   welcomeDescription: 'Learn more about the Accountability Dial',
  //   primary_lighter: '#2B2670',
  //   primary_light: '#2B2670',
  //   primary: '#2B2670',
  //   primary_dark: '#2B2670',
  //   primary_darker: '#2B2670',
  //   primary_darkest: '#2B2670',
  //   tabTitle: 'The Accountability Dial',
  //   partnerName: 'Benji',
  //   startSession: 'Start Session',
  //   launchSession: 'Launch Session',
  //   joinArrow: './assets/img/joinlaunch_muralys.png',
  //   rightCaret: './assets/img/right_caret_muralys.png',
  //   rightLaunchArrow: './assets/img/launch_singlearrow_muralys.png',
  //   infoIcon: './assets/img/info_icon.png',
  //   checkIcon: './assets/img/check_icon_muralys.png',
  //   joinLobbyUrl: 'join.refound.com',
  //   // primary_lighter: '#f8b0ac',
  //   // primary_light: '#fa8b85',
  //   // primary: '#fd4b42',
  //   // primary_dark: '#fd261b',
  //   // primary_darker: '#c91006',
  //   // primary_darkest: '#830700'
  // },
  name: 'Benji',
  welcome_text: 'Welcome to Benji',
  link: 'https://wwww.benji.com',
  logo: '',
  favicon: './assets/img/favicon.ico',
  parameters: {
    lightLogo: './assets/img/Benji_logo_white.png',
    darkLogo: './assets/img/logo.png',
    welcomeDescription: 'What\'s Benji? Learn more about the future of learning',
    primary_lighter: '#80a8ff',
    primary_light: '#4c83fc',
    primary: '#0a4cef',
    primary_dark: '#4c188f',
    primary_darker: '#3a126e',
    primary_darkest: '#00178a',
    tabTitle: 'Benji',
    partnerName: 'Benji',
    startSession: 'Start session',
    launchSession: 'Launch session',
    joinArrow: './assets/img/joinlaunch.png',
    rightCaret: './assets/img/right_caret.png',
    rightLaunchArrow: './assets/img/launch_singlearrow.png',
    infoIcon: './assets/img/info_icon.png',
    checkIcon: './assets/img/check_icon.png',
    joinLobbyUrl: 'join.mybenji.com',
    // primary_lighter: '#f8b0ac',
    // primary_light: '#fa8b85',
    // primary: '#fd4b42',
    // primary_dark: '#fd261b',
    // primary_darker: '#c91006',
    // primary_darkest: '#830700'
  },
};

export const DefaultwhiteLabelInfo1 = {
  name: 'Muraly Srinarayanathas',
  welcome_text: 'The Maestro Mindset!',
  link: 'https://muralys.com/',
  logo: './assets/img/muraly_logo.png',
  favicon: './assets/img/refound_favicon.png',
  parameters: {
    lightLogo: './assets/img/muraly_logo_white.png',
    darkLogo: './assets/img/muraly_logo.png',
    welcomeDescription:
      'What is The Maestro Mindset? Learn more about composing the symphony of your life',
    primary_lighter: '#00778B',
    primary_light: '#00778B',
    primary: '#00778B',
    primary_dark: '#004F71',
    primary_darker: '#004F71',
    primary_darkest: '#004F71',
    tabTitle: 'Muraly Srinarayanathas | The Maestro Mindset',
    partnerName: 'Benji',
    startSession: 'Start Session',
    launchSession: 'Launch Session',
    joinArrow: './assets/img/joinlaunch_muralys.png',
    rightCaret: './assets/img/right_caret_muralys.png',
    rightLaunchArrow: './assets/img/launch_singlearrow_muralys.png',
    infoIcon: './assets/img/info_icon.png',
    checkIcon: './assets/img/check_icon_muralys.png',
    joinLobbyUrl: 'join.muralys.com',
    // primary_lighter: '#f8b0ac',
    // primary_light: '#fa8b85',
    // primary: '#fd4b42',
    // primary_dark: '#fd261b',
    // primary_darker: '#c91006',
    // primary_darkest: '#830700'
  },
};

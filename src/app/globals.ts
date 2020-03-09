'use strict';

import { environment } from './../environments/environment';

const backend = environment.host;
const web_protocol = environment.web_protocol;
const socket_protocl = environment.socket_protocl;

export const apiRoot = web_protocol + '://' + backend + '/api';
export const wsRoot = socket_protocl + '://' + backend;

export enum ActivityTypes {
  brainStorm = 'BrainstormActivity',
  pitchoMatic = 'PitchoMaticActivity',
  buildAPitch = 'BuildAPitchActivity',
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
  triadGrouping = 'TriadGroupingActivity'
}
// export type MeasurementTimeframe = 'alltime' | 'year' | 'month' | 'week' | 'day';

export const DefaultwhiteLabelInfo = {
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
    startSession: 'start session',
    launchSession: 'launch session',
    joinArrow: './assets/img/joinlaunch.png',
    rightCaret: './assets/img/right_caret.png',
    rightLaunchArrow: './assets/img/launch_singlearrow.png',
    infoIcon: './assets/img/info_icon.png',
    checkIcon: './assets/img/check_icon.png'
    // primary_lighter: '#f8b0ac',
    // primary_light: '#fa8b85',
    // primary: '#fd4b42',
    // primary_dark: '#fd261b',
    // primary_darker: '#c91006',
    // primary_darkest: '#830700'
  }
};

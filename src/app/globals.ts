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

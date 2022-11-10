import { MainScreenLobbyComponent } from './lobby-activity/lobby.component';
import { MainScreenLessonComponent } from './main-screen-lesson.component';
import { MainScreenMcqresultActivityComponent } from './mcqresult-activity/mcqresult-activity.component';
import { MainScreenMontyHallComponent } from './monty-hall/monty-hall.component';
import { MainScreenPairGroupingActivityComponent } from './pair-grouping-activity/pair-grouping-activity.component';
import { MainScreenPairActivityComponent } from './roleplay-pair-activity/roleplay-pair-activity.component';
import { SharedMainScreenComponents } from './shared/index';
export { MainScreenBrainStormComponents } from './brainstorming-activity';
export * from './brainstorming-activity';
export { MainScreenPopQuizComponent } from './pop-quiz/pop-quiz.component';
export { MainScreenPollComponent } from './poll-activity/poll-activity.component';
export { MainScreenLessonComponent };

export const MainScreenComponents = [
  ...SharedMainScreenComponents,
  MainScreenLessonComponent,
  MainScreenLobbyComponent,
  MainScreenMontyHallComponent,
  MainScreenMcqresultActivityComponent,
  MainScreenPairActivityComponent,
  MainScreenPairGroupingActivityComponent,
];

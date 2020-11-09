import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ActivityTypes } from 'src/app/globals';
import { OverviewLessonActivity } from 'src/app/services/backend/schema';
import * as fromStore from '../../store';

@Component({
  selector: 'benji-activity-help',
  templateUrl: './activity-help.component.html',
  styleUrls: ['./activity-help.component.scss'],
})
export class ActivityHelpComponent implements OnInit {
  activityHelp = ActivityHelp;
  at = ActivityTypes;
  activity$: Observable<any>;
  constructor(private store: Store<fromStore.EditorState>) {}

  ngOnInit() {
    this.store.select(fromStore.getSelectedLessonActivity).subscribe((val: OverviewLessonActivity) => {
      if (val) {
        this.activityHelp = ActivityHelp[val.activity_type];
      }
    });
  }
}

export const ActivityHelp = {
  [ActivityTypes.mcq]: [
    {
      type: 'header',
      content: 'Overview',
    },
    {
      type: 'paragraph',
      content: `Our multiple choice activity works just as you’d expect.
              Ask your participants a question and they have
              to pick the correct answer. You select which questions are right.`,
    },
    {
      type: 'paragraph',
      content: `If you pick multiple correct answers then
              they have to pick all that are correct. Here’s a video walking
              you through this!`,
    },
    {
      type: 'image',
      content: '/assets/img/helpimg.png',
    },
    {
      type: 'header',
      content: 'Tips',
    },
    {
      type: 'video',
      content: 'https://player.vimeo.com/video/475232410',
    },
  ],
  [ActivityTypes.feedback]: [
    {
      type: 'header',
      content: 'Overview',
    },
    {
      type: 'paragraph',
      content: `Our Feedback tools has two different types of questions you can ask.
      Our open text allows your participants to submit text.
      Our rating questions give you a five-point scale from strongly disagree to strongly agree. `,
    },
    {
      type: 'video',
      content:
        // tslint:disable-next-line:max-line-length
        'https://player.vimeo.com/external/298880631.hd.mp4?s=69e47bc8bbb2f9bfcbbc919fab096e326ede516a&profile_id=175',
    },
  ],
  [ActivityTypes.title]: [],
  [ActivityTypes.caseStudy]: [
    {
      type: 'video',
      content: 'https://player.vimeo.com/video/475232644',
    },
  ],
  [ActivityTypes.genericRoleplay]: [
    {
      type: 'video',
      content: 'https://player.vimeo.com/video/475232343',
    },
  ],
  [ActivityTypes.brainStorm]: [
    {
      type: 'header',
      content: 'Overview',
    },
    {
      type: 'paragraph',
      content: `Design your brainstorms around a simple prompt.
      Once you've decided on the prompt, you can now tailor the brainstorm exactly to your needs.`,
    },
    {
      type: 'paragraph',
      content: `How many times do you want participants to submit ideas.
      Will participant's be voting on submitted ideas? If so, how many times?
      How long will participants have to vote? If you'd like,
      we have a "winner" screen which will show you the top 3 vote-getting ideas. `,
    },
    {
      type: 'paragraph',
      content: `Design your brainstorms around a simple prompt.
      Once you've decided on the prompt, you can now tailor the brainstorm exactly to your needs.`,
    },
    {
      type: 'video',
      content: `https://player.vimeo.com/video/475232517`,
    },
  ],
  [ActivityTypes.whereDoYouStand]: [
    {
      type: 'header',
      content: 'Overview',
    },
    {
      type: 'paragraph',
      content: `Where do you stand help`,
    },
    {
      type: 'paragraph',
      content: `How many times do you want participants to submit ideas.
      Will participant's be voting on submitted ideas? If so, how many times?
      How long will participants have to vote? If you'd like,
      we have a "winner" screen which will show you the top 3 vote-getting ideas. `,
    },
    {
      type: 'paragraph',
      content: `Design your brainstorms around a simple prompt.
      Once you've decided on the prompt, you can now tailor the brainstorm exactly to your needs.`,
    },
    {
      type: 'video',
      content: `https://player.vimeo.com/video/475232517`,
    },
  ],
  [ActivityTypes.buildAPitch]: [
    {
      type: 'header',
      content: 'Overview',
    },
    {
      type: 'paragraph',
      content: `build a pitch help`,
    },
    {
      type: 'paragraph',
      content: `How many times do you want participants to submit ideas.
      Will participant's be voting on submitted ideas? If so, how many times?
      How long will participants have to vote? If you'd like,
      we have a "winner" screen which will show you the top 3 vote-getting ideas. `,
    },
    {
      type: 'paragraph',
      content: `Design your brainstorms around a simple prompt.
      Once you've decided on the prompt, you can now tailor the brainstorm exactly to your needs.`,
    },
    {
      type: 'video',
      content: `https://player.vimeo.com/video/475232517`,
    },
  ],
};

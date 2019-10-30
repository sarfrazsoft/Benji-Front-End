import { Component, Input, OnInit } from '@angular/core';
import { ActivityReport } from 'src/app/services/backend/schema';

@Component({
  selector: 'benji-brain-storm',
  templateUrl: './brain-storm.component.html',
  styleUrls: ['./brain-storm.component.scss']
})
export class BrainStormComponent implements OnInit {
  @Input() data: any = brainstorm;
  constructor() {}

  ngOnInit() {}
}

const brainstorm = {
  joined_users: [{}, {}],
  prompt: 'Prompt Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  ideas: [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Integer nec odio. Praesent libero. Sed cursus ante dapibus' +
      ' diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. ' +
      'Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue ' +
      'semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla.',
    'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
    'Curabitur sodales ligula in libero. Sed dignissim lacinia nunc.',
    'Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. ' +
      'Maecenas mattis. Sed convallis tristique sem.',
    ' Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum.' +
      ' Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in,',
    'Class aptent taciti sociosqu',
    'Sed lectus. Integer euismod lacus luctus magna'
  ]
};

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'benji-build-a-pitch-report',
  templateUrl: './build-a-pitch.component.html',
  styleUrls: ['./build-a-pitch.component.scss']
})
export class BuildAPitchComponent implements OnInit {
  constructor() {}

  displayedColumns: string[] = [
    'prompt',
    'person1',
    'person2',
    'person3',
    'person4',
    'person5',
    'person6',
    'person7',
    'person8',
    'person9',
    'person10'
  ];
  bapTableData = [
    {
      prompt: 'My organization',
      person1: 'Benji',
      person2: 'Benji',
      person3: 'Benx',
      person4: 'Scaling their workshops Scaling their workshops',
      person5: 'Our Company is good',
      person6: 'Scaling their workshops',
      person7: 'Scaling their workshops Scaling their workshops',
      person8: 'Our Company is good',
      person9: 'Scaling their workshops',
      person10: 'Scaling their workshops'
    },
    {
      prompt: 'Helps (audience)',
      person1: 'Companies',
      person2: 'Trainers',
      person3: 'Learners',
      person4: 'Scaling their workshops',
      person5: 'Scaling their workshops now this is a long answer',
      person6: 'Scaling their workshops',
      person7: 'Scaling their workshops Scaling their workshops',
      person8: 'Our Company is good',
      person9: 'Scaling their workshops',
      person10: 'Scaling their workshops'
    },
    {
      prompt: 'With (problem)',
      person1: 'Scaling their workshops',
      person2: 'scale their company',
      person3: 'master soft skills',
      person4: 'Benx soft skills Scaling their workshops',
      person5: 'Benx red hollow',
      person6: 'Scaling their workshops',
      person7: 'Scaling their workshops Scaling their workshops',
      person8: 'Our Company is good',
      person9: 'Scaling their workshops',
      person10: 'Scaling their workshops'
    },
    {
      prompt: 'Because (the why)',
      person1: 'Face to face learning is a sham',
      person2: 'limited resources',
      person3: 'future bros',
      person4: 'Scaling their workshops ',
      person5: 'Benx future bros',
      person6: 'Scaling their workshops',
      person7: 'Scaling their workshops Scaling their workshops',
      person8: 'Our Company is good',
      person9: 'Scaling their workshops',
      person10: 'Scaling their workshops'
    }
  ];

  getPersonName(name: string) {
    const namesMap = {
      person1: 'Matthew Perry',
      person2: 'Ross Gellar',
      person3: 'Abdullah M',
      person4: 'Matt',
      person5: 'Brr',
      person6: 'Mahin',
      person7: 'Rebel',
      person8: 'Baghi jii',
      person9: 'Donald Trump',
      person10: 'Scaling their workshops'
    };

    return namesMap[name];
  }

  getTotalVotes(name: string) {
    const votesMap = {
      person1: '2',
      person2: '3',
      person3: '4',
      person4: '1',
      person5: '0',
      person6: '0',
      person7: '1',
      person8: '2',
      person9: '0',
      person10: '0'
    };

    return votesMap[name];
  }

  ngOnInit() {}
}

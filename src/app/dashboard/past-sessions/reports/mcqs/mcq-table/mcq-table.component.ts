import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'benji-mcq-table',
  templateUrl: './mcq-table.component.html',
  styleUrls: ['./mcq-table.component.scss']
})
export class McqTableComponent implements OnInit {
  @Input() questionStatement = '';
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
      prompt: 'Matthew Parson',
      person1: '-',
      person2: '-',
      person3: '-',
      person4: '-'
    },
    {
      prompt: 'Abdullah M',
      person1: '-',
      person2: '-',
      person3: '-',
      person4: '-'
    },
    {
      prompt: 'Mahin Khan',
      person1: '-',
      person2: '-',
      person3: '-',
      person4: '-'
    },
    {
      prompt: 'Azim Wazeer',
      person1: '-',
      person2: '-',
      person3: '-',
      person4: '-'
    }
  ];

  getColumnHeader(name: string) {
    const columnHeaderMap = {
      person1: 'Make it relatable',
      person2: 'Make it surprising',
      person3: 'Make it short',
      person4: 'All of the above'
    };

    return columnHeaderMap[name];
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

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService, ContextService } from 'src/app/services';


export interface Folder {
  id: number;
  lessons: Array<any>;
  name: string;
}

@Component({
  selector: 'benji-folder',
  templateUrl: './folder.component.html',
})
export class FolderComponent implements OnInit {
  @Input() folder: Folder;
  @Output() createOrUpdateFolder = new EventEmitter();
  @Output() deleteFolder = new EventEmitter();
  @Output() selectFolder = new EventEmitter();

  selectedFolder: number;
  imgSrc: string;

  constructor(
    private contextService: ContextService
  ) {}

  ngOnInit() {
    this.imgSrc = '/assets/img/dashboard/folder.svg';

    this.contextService.selectedFolder$.subscribe((folder) => {
      this.selectedFolder = folder;
    });
  }
}

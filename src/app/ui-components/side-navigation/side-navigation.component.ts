import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { UpdateMessage, BrainstormEditInstructionEvent, BrainstormEditSubInstructionEvent } from 'src/app/services/backend/schema';

@Component({
  selector: 'side-navigation',
  templateUrl: 'side-navigation.component.html',
})
export class SideNavigationComponent implements OnInit {
  @Input() activityState: UpdateMessage;
  @Input() sidenav: MatSidenav;
  @Input() navType: string;
  editingInstructions: boolean;
  @ViewChild('title') InstructionsElement: ElementRef;
  editingSubInstructions: boolean;
  @ViewChild('instructions') SubInstructionsElement: ElementRef;
  @Output() sendMessage = new EventEmitter<any>();
  instructions = "";
  sub_instructions = "";

  statusDropdown = [ "Active", "View Only", "Hidden" ];

  participants = [ "Me Pi", "Alex Mat", "Lee Nim", "Sam M" ];

  ngOnInit(): void {
    if(this.activityState && this.activityState.brainstormactivity) {
      this.instructions = this.activityState.brainstormactivity.instructions;
      this.sub_instructions = this.activityState.brainstormactivity.sub_instructions;
    }
  }

  diplayInfo() {
    console.log(this.activityState);
  }
  
  closeNav() {
    this.sidenav.close();
  }

  editInstructions() {
    this.editingInstructions = true;
    setTimeout(() => {
      this.InstructionsElement.nativeElement.focus();
    }, 0);
  }

  saveEditedInstructions() {
    this.editingInstructions = false;
    this.sendMessage.emit(new BrainstormEditInstructionEvent(this.instructions));
  }
  
  editSubInstructions() {
    this.editingSubInstructions = true;
    setTimeout(() => {
      this.SubInstructionsElement.nativeElement.focus();
    }, 0);
  }

  saveEditedSubInstructions() {
    this.editingSubInstructions = false;
    this.sendMessage.emit(new BrainstormEditSubInstructionEvent(this.sub_instructions));
  }

  getInitials(nameString: string) {
    const fullName = nameString.split(' ');
    const first = fullName[0] ? fullName[0].charAt(0) : '';
    const second = fullName[1] ? fullName[1].charAt(0) : '';
    return (first + second).toUpperCase();
  }

}

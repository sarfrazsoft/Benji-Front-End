import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { UpdateMessage, BrainstormEditInstructionEvent } from 'src/app/services/backend/schema';

@Component({
  selector: 'side-navigation',
  templateUrl: 'side-navigation.component.html',
})
export class SideNavigationComponent {
  @Input() activityState: UpdateMessage;
  @Input() sidenav: MatSidenav;
  editingInstructions: boolean;
  @ViewChild('title') InstructionsElement: ElementRef;
  @Output() sendMessage = new EventEmitter<any>();
  instructions = "Group 1’s space Talk about SpriderMan";

  statusDropdown = [ "Active", "View Only", "Hidden" ];

  ngOnInit(): void {
    if(this.activityState) {
      this.instructions = this.activityState.brainstormactivity.instructions;
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
}

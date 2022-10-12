import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, of, Subscription } from 'rxjs';

@Component({
  selector: 'benji-mentions-list',
  templateUrl: './mentions.component.html',
  styleUrls: ['./mentions.component.scss'],
})
export class MentionsListComponent implements OnInit {
  @Input() props: Record<string, any>;
  @Input() editor;
  @Output() itemSelected = new EventEmitter<any>();

  selectedItemIndex = 0;
  selectedGroupIndex = 0;
  items: string[];
  search: BehaviorSubject<string> = new BehaviorSubject(null);

  private searchSubscription: Subscription;

  upHandler() {
    const selectedGroup = this.props.items[this.selectedGroupIndex];
    const selectedItem = selectedGroup.childCommands[this.selectedItemIndex];
    // if selectedItemIndex is at first item in the group
    if (this.selectedItemIndex === 0) {
      // we are on the first item in the group
      // move on to the previous group
      if (this.selectedGroupIndex === 0) {
        // if it is the first group
        this.selectedGroupIndex = this.props.items.length - 1;
      } else {
        this.selectedGroupIndex = this.selectedGroupIndex - 1;
      }
      // select last item of the group
      this.selectedItemIndex = this.props.items[this.selectedGroupIndex].childCommands.length - 1;
    } else {
      // we're not on the first item in the group
      this.selectedItemIndex = this.selectedItemIndex - 1;
    }
  }

  downHandler() {
    const selectedGroup = this.props.items[this.selectedGroupIndex];
    const selectedItem = selectedGroup.childCommands[this.selectedItemIndex];
    // if selectedItemIndex is at last item in the group
    if (this.selectedItemIndex === selectedGroup.childCommands.length - 1) {
      // we are on the last item in the group
      // move on to the next group
      if (this.selectedGroupIndex === this.props.items.length - 1) {
        // if it is the last group
        this.selectedGroupIndex = 0;
      } else {
        this.selectedGroupIndex = this.selectedGroupIndex + 1;
      }
      this.selectedItemIndex = 0;
    } else {
      // we're not on the last item in the group
      this.selectedItemIndex = this.selectedItemIndex + 1;
    }
  }

  enterHandler() {
    this.selectItem(this.selectedItemIndex, this.selectedGroupIndex);
  }

  selectItem(selectedItemIndex: number, selectedGroupIndex: number) {
    const selectedGroup = this.props.items[selectedGroupIndex];
    const selectedItem = selectedGroup.childCommands[selectedItemIndex];
    if (selectedItem) {
      this.itemSelected.emit(selectedItem);
    }
  }

  onKeyDown({ event }) {
    console.log(event.key);
    if (event.key === 'ArrowUp') {
      this.upHandler();
      return true;
    }

    if (event.key === 'ArrowDown') {
      this.downHandler();
      return true;
    }

    if (event.key === 'Enter') {
      this.enterHandler();
      return true;
    }

    return false;
  }

  ngOnInit() {}

  OnDestroy() {
    if (!!this.searchSubscription && !this.searchSubscription.closed) {
      this.searchSubscription.unsubscribe();
    }
  }
}

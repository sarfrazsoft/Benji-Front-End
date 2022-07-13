import { CdkDragEnter, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { NgxMasonryComponent, NgxMasonryOptions } from 'ngx-masonry';
import { NgxPermissionsService } from 'ngx-permissions';
import { BrainstormService } from 'src/app/services';
import { Board, BrainstormActivity, Idea, SetMetaDataBoardEvent } from 'src/app/services/backend/schema';
import { environment } from 'src/environments/environment';
declare var Packery: any;
declare var Draggabilly: any;

@Component({
  selector: 'benji-unsorted-ideas',
  templateUrl: './unsorted.component.html',
})
export class UnsortedComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() board: Board;
  @Input() act: BrainstormActivity;
  @Input() activityState;
  @Input() minWidth;
  @Input() sendMessage;
  @Input() joinedUsers;
  @Input() showUserName;
  @Input() participantCode;
  @Input() eventType;
  @Input() isColumnsLayout;
  @Input() myGroup;
  @Input() isHost;

  ideas = [];
  cycle = 'first';

  hostname = environment.web_protocol + '://' + environment.host;

  @Output() viewImage = new EventEmitter<string>();
  @Output() deleteIdea = new EventEmitter<Idea>();

  public masonryOptions: NgxMasonryOptions = {
    gutter: 16,
    horizontalOrder: true,
    initLayout: true,
    fitWidth: true,
  };

  @ViewChild(NgxMasonryComponent) masonry: NgxMasonryComponent;
  masonryPrepend: boolean;

  packery;
  ideasOrder = [];
  draggies;
  showItems = false;

  ideasSetOrder = [
    { id: '2651', order: 0 },
    { id: '2611', order: 1 },
    { id: '2658', order: 2 },
    { id: '2650', order: 3 },
    { id: '2659', order: 4 },
    { id: '2606', order: 5 },
    { id: '2660', order: 6 },
    { id: '2655', order: 7 },
    { id: '2637', order: 8 },
    { id: '2609', order: 9 },
    { id: '2610', order: 10 },
  ];

  constructor(
    private brainstormService: BrainstormService,
    private ngxPermissionService: NgxPermissionsService
  ) {}

  ngOnInit(): void {}

  ngOnChanges($event: SimpleChanges) {
    if (this.cycle === 'first' || this.eventType === 'filtered') {
      this.ideas = [];
      this.showItems = true;
      const ideas = this.brainstormService.uncategorizedPopulateIdeas(this.board);
      const sortedIdeas = this.sortOnOrder(ideas, this.ideasSetOrder);
      this.ideas = sortedIdeas;
      this.brainstormService.uncategorizedIdeas = this.ideas;
      this.cycle = 'second';
    } else {
      if (
        this.eventType === 'BrainstormEditBoardInstruction' ||
        this.eventType === 'BrainstormEditSubInstruction'
      ) {
      } else if (this.eventType === 'BrainstormSubmitEvent') {
        if (this.board.sort === 'newest_to_oldest') {
          this.masonryPrepend = true;
        } else {
          this.masonryPrepend = false;
        }
        this.brainstormService.uncategorizedAddIdea(this.board, this.ideas, () => {
          this.ideas = this.brainstormService.uncategorizedSortIdeas(this.board, this.ideas);
          setTimeout(() => {
            this.resetMasonry();
          }, 50);
        });
      } else if (
        this.eventType === 'BrainstormSubmitIdeaCommentEvent' ||
        this.eventType === 'BrainstormRemoveIdeaCommentEvent'
      ) {
        this.brainstormService.uncategorizedIdeaCommented(this.board, this.ideas);
        this.refreshMasonryLayout();
      } else if (
        this.eventType === 'BrainstormSubmitIdeaHeartEvent' ||
        this.eventType === 'BrainstormRemoveIdeaHeartEvent'
      ) {
        this.brainstormService.uncategorizedIdeaHearted(this.board, this.ideas, () => {});
        this.brainstormService.uncategorizedSortIdeas(this.board, this.ideas);
        this.masonry?.layout();
        this.masonry?.reloadItems();
      } else if (
        this.eventType === 'BrainstormRemoveSubmissionEvent' ||
        this.eventType === 'BrainstormClearBoardIdeaEvent'
      ) {
        this.brainstormService.uncategorizedIdeasRemoved(this.board, this.ideas);
      } else if (this.eventType === 'BrainstormEditIdeaSubmitEvent') {
        this.brainstormService.uncategorizedIdeaEdited(this.board, this.ideas);
        this.refreshMasonryLayout();
      } else if (
        this.eventType === 'HostChangeBoardEvent' ||
        this.eventType === 'ParticipantChangeBoardEvent'
      ) {
        if ($event.board) {
          if ($event.board.currentValue.id === $event.board.previousValue.id) {
          } else {
            this.ideas = [];
            this.ideas = this.brainstormService.uncategorizedPopulateIdeas(this.board);
            this.brainstormService.uncategorizedIdeas = this.ideas;
          }
        }
      } else if (this.eventType === 'BrainstormBoardSortOrderEvent') {
        this.brainstormService.uncategorizedSortIdeas(this.board, this.ideas);
        setTimeout(() => {
          this.resetMasonry();
        }, 50);
      } else if (
        this.eventType === 'BrainstormAddIdeaPinEvent' ||
        this.eventType === 'BrainstormRemoveIdeaPinEvent'
      ) {
        this.brainstormService.uncategorizedUpdateIdeasPin(this.board, this.ideas);
        this.masonry?.reloadItems();
        this.brainstormService.uncategorizedSortIdeas(this.board, this.ideas);
        this.masonry?.layout();
      } else if (this.eventType === 'BrainstormToggleParticipantNameEvent') {
        this.refreshMasonryLayout();
      } else if (this.eventType === 'BrainstormToggleMeetingMode') {
        if (this.act.meeting_mode) {
          // host just turned on meeting mode
          // take all users to new board
          this.ngxPermissionService.hasPermission('ADMIN').then((val) => {
            if (val) {
            }
          });
          this.ngxPermissionService.hasPermission('PARTICIPANT').then((val) => {
            if (val) {
              this.ideas = [];
              this.ideas = this.brainstormService.uncategorizedPopulateIdeas(this.board);
              this.brainstormService.uncategorizedIdeas = this.ideas;
            }
          });
        } else {
          // host just turned off meeting mode.
          // do nothing
        }
      } else if (
        this.eventType === 'BrainstormChangeBoardStatusEvent' ||
        this.eventType === 'BrainstormToggleAllowCommentEvent'
      ) {
        this.masonry?.layout();
      } else if (this.eventType === 'SetMetaDataBoardEvent') {
        if (this.board.meta.updated === 'post_order') {
          // this.ideas = [];
          // this.showItems = false;
          // // setTimeout(() => {
          // this.showItems = true;
          // const ideas = this.brainstormService.uncategorizedPopulateIdeas(this.board);
          // const sortedIdeas = this.sortOnOrder(ideas, this.board.meta.post_order);
          // this.ideas = sortedIdeas;
          // this.brainstormService.uncategorizedIdeas = this.ideas;
          // setTimeout(() => {
          //   // this.packery.layout();
          //   this.setUpPackery();
          // }, 500);
          // }, 500);
        }
      }
    }
  }

  ngAfterViewInit(): void {
    this.setUpPackery();
  }

  setUpPackery() {
    const elem = document.querySelector('.grid');
    const pckry = new Packery(elem, {
      // options
      itemSelector: '.grid-item',
      gutter: 10,
      columnWidth: 300,
    });
    this.packery = pckry;

    // if you have multiple .draggable elements
    // get all draggie elements
    const draggableElems = document.querySelectorAll('.grid-item');
    // array of Draggabillies
    const draggies = [];
    // init Draggabillies
    for (let i = 0; i < draggableElems.length; i++) {
      const draggableElem = draggableElems[i];
      const draggie = new Draggabilly(draggableElem, {
        // options...
      });
      pckry.bindDraggabillyEvents(draggie);
      draggies.push(draggie);
    }
    this.draggies = draggies;
    // setTimeout(() => {
    //   pckry.layout();
    // }, 500);

    setTimeout(() => {
      pckry.layout();
    }, 500);

    pckry.on('layoutComplete', () => {
      pckry.getItemElements().forEach((itemElem: any, i) => {
        if (this.ideasOrder[i]) {
        } else {
          this.ideasOrder.push({ id: itemElem.getAttribute('id'), order: i });
        }
      });
    });
    this.packery.on('dragItemPositioned', () => {
      pckry.getItemElements().forEach((itemElem: any, i) => {
        itemElem.setAttribute('order', i);
        if (this.ideasOrder[i]) {
          this.ideasOrder[i] = { id: itemElem.getAttribute('id'), order: i };
        }
      });
      setTimeout(() => {
        console.log(this.draggies);
      }, 300);
      this.sendMessage.emit(
        new SetMetaDataBoardEvent(this.board.id, {
          updated: 'post_order',
          post_order: this.ideasOrder,
        })
      );
      console.log(JSON.stringify(this.ideasOrder));
    });
  }

  sortOnOrder(ideas, sortOrder) {
    const posts = [];
    sortOrder.forEach((order) => {
      ideas.forEach((idea) => {
        if (Number(idea.id) === Number(order.id)) {
          posts.push(idea);
        }
      });
    });
    return posts;
  }

  resetMasonry() {
    if (this.masonry) {
      this.masonry.reloadItems();
      this.masonry.layout();
    }
  }

  refreshMasonryLayout() {
    if (this.masonry) {
      this.masonry.layout();
    }
  }

  isAbsolutePath(imageUrl: string) {
    if (imageUrl.includes('https:')) {
      return true;
    } else {
      return false;
    }
  }

  openImage(imageUrl: string) {
    this.viewImage.emit(imageUrl);
  }

  getPersonName(idea: Idea) {
    if (idea && idea.submitting_participant) {
      const user = this.joinedUsers.find(
        (u) => u.participant_code === idea.submitting_participant.participant_code
      );
      return user.display_name;
    }
  }

  delete(id) {
    this.deleteIdea.emit(id);
  }

  getUserRole(item: Idea) {
    const obj = this.brainstormService.getUserRole(this.participantCode, item, this.board.status);
    return obj.userRole;
  }
  canViewIdea(idea: Idea) {
    const userRole = this.getUserRole(idea);
    return this.brainstormService.canViewIdea(this.board.status, userRole, this.isHost);
  }

  dragEntered(event: CdkDragEnter<number>) {
    const drag = event.item;
    const dropList = event.container;
    const dragIndex = drag.data;
    const dropIndex = dropList.data;

    const phContainer = dropList.element.nativeElement;
    const phElement = phContainer.querySelector('.cdk-drag-placeholder');
    phContainer.removeChild(phElement);
    phContainer.parentElement.insertBefore(phElement, phContainer);

    moveItemInArray(this.ideas, dragIndex, dropIndex);
  }
}

// function orderItems() {
//   // console.log(this.ideas);
//   pckry.getItemElements().forEach((itemElem: any, i) => {
//     const text = i;
//     itemElem = { ...itemElem, textContent: itemElem.textContent + i };
//   });
// }

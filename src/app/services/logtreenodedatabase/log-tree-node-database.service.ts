import { SubscriptionService } from '../subscription/subscription.service';
import { ItemNode } from './../../models/item-node';
import { ItemFlatNode } from './../../models/item-flat-node';
import { Injectable } from '@angular/core';
import { BehaviorSubject} from 'rxjs';
import { AwslogService } from './../../services/awslog/awslog.service';
import { SelectionModel} from '@angular/cdk/collections';
import { Subject, Subscription} from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LogTreeNodeDatabaseService {
  public dataChange = new BehaviorSubject<ItemNode[]>([]);
  // SelectionModel for the tree checklist
  public logSelection: SelectionModel<ItemFlatNode> = new SelectionModel<ItemFlatNode>(true);

  get data(): ItemNode[] { return this.dataChange.value; }

  // Event bus to transmit click events
  private subject$ = new Subject();

  constructor(private awslogservice: AwslogService,
              private subscriptionService: SubscriptionService ) {
    this.initialize(awslogservice);
    // Subscribe to receive new data load events
    subscriptionService.on('log-data-change', (e) => {
      this.initialize(awslogservice);
    });
  }

  initialize(awslogservice: AwslogService) {
    const data = this.dataToTreeNodes(awslogservice.logObj);
    this.dataChange.next(data);
  }


  /************************************************************************************************
   * Change event bus
   * Subscribable event messages: ['tree-node-change']
   ************************************************************************************************/
  emit(event: string) {
    this.subject$.next(event);
  }

  on(eventName: string, action: any): Subscription {
    return this.subject$.pipe(
      filter((e: string) => e === eventName))
    .subscribe(action);
  }

  /************************************************************************************************
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `ItemNode`.
   ************************************************************************************************/
  dataToTreeNodes(iterationContainerObj): ItemNode[] {
    const nodeArr: ItemNode[] = [];
    Object.keys(iterationContainerObj).forEach(iterationKey => {
      const iterationNode = new ItemNode();
      iterationNode.children = [];
      nodeArr.push(iterationNode);
      const iterationObj = iterationContainerObj[iterationKey];
      iterationNode.source = iterationObj;
      iterationNode.item = 'iteration ' + iterationKey + ' (' + Object.keys(iterationObj).length + ')';
      Object.keys(iterationObj).forEach(episodeKey => {
        const episodeNode = new ItemNode();
        iterationNode.children.push(episodeNode);
        const episodeObj = iterationObj[episodeKey];
        const rewardText = (episodeObj.header) ? 'total reward: ' + episodeObj.header['total reward'] : '';
        episodeNode.source = episodeObj;
        episodeNode.item = 'episode ' + episodeKey +  ' (' + episodeObj.steps.length + ') [' + rewardText + ']';
      });
    });
    return nodeArr;
  }

  /***********************************************************************************************************
   * Fetch array of episodes that the user has selected
   ***********************************************************************************************************/
  getSelectedEpisodes() {
    return this.logSelection.selected
    .filter((itemFlatNode) => {
      return itemFlatNode.source.steps; // Only fetch the episode nodes
    }).map((itemFlatNode) => {
      return itemFlatNode.source;
    });
  }
}

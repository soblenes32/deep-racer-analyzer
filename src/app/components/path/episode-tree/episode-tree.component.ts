import { SubscriptionService } from '../../../services/subscription/subscription.service';
import {SelectionModel} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import {Component, Injectable, OnInit} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { LogTreeNodeDatabaseService } from './../../../services/logtreenodedatabase/log-tree-node-database.service';
import { ItemNode } from './../../../models/item-node';
import { ItemFlatNode } from './../../../models/item-flat-node';

@Component({
  selector: 'app-episode-tree',
  templateUrl: './episode-tree.component.html',
  styleUrls: ['./episode-tree.component.css']
})
export class EpisodeTreeComponent implements OnInit {

  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<ItemFlatNode, ItemNode>();
  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<ItemNode, ItemFlatNode>();
  /** A selected parent node to be inserted */
  selectedParent: ItemFlatNode | null = null;
  /** The new item's name */
  newItemName = '';
  treeControl: FlatTreeControl<ItemFlatNode>;
  treeFlattener: MatTreeFlattener<ItemNode, ItemFlatNode>;
  dataSource: MatTreeFlatDataSource<ItemNode, ItemFlatNode>;
  private logSelection: SelectionModel<ItemFlatNode>;

  // tslint:disable-next-line: variable-name
  constructor(private logTreeNodeDatabaseService: LogTreeNodeDatabaseService) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<ItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.logSelection = logTreeNodeDatabaseService.logSelection;

    // Subscribe to receive selection change events
    logTreeNodeDatabaseService.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });
  }


  getLevel = (node: ItemFlatNode) => node.level;
  isExpandable = (node: ItemFlatNode) => node.expandable;
  getChildren = (node: ItemNode): ItemNode[] => node.children;
  hasChild = (_: number, nodeData: ItemFlatNode) => nodeData.expandable;
  hasNoContent = (_: number, nodeData: ItemFlatNode) => nodeData.item === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: ItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.item === node.item
        ? existingNode
        : new ItemFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.source = node.source;
    flatNode.expandable = !!node.children;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: ItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.logSelection.isSelected(child)
    );
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: ItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.logSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the log item selection. Select/deselect all the descendants node */
  logItemSelectionToggle(node: ItemFlatNode): void {
    this.logSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.logSelection.isSelected(node)
      ? this.logSelection.select(...descendants)
      : this.logSelection.deselect(...descendants);
    // Force update for the parent
    descendants.every(child =>
      this.logSelection.isSelected(child)
    );
    this.checkAllParentsSelection(node);
    this.logTreeNodeDatabaseService.emit('tree-node-change');
  }

  /** Toggle a leaf log item selection. Check all the parents to see if they changed */
  logLeafItemSelectionToggle(node: ItemFlatNode): void {
    this.logSelection.toggle(node);
    this.checkAllParentsSelection(node);
    this.logTreeNodeDatabaseService.emit('tree-node-change');
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: ItemFlatNode): void {
    let parent: ItemFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: ItemFlatNode): void {
    const nodeSelected = this.logSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.logSelection.isSelected(child)
    );
    if (nodeSelected && !descAllSelected) {
      this.logSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.logSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: ItemFlatNode): ItemFlatNode | null {
    const currentLevel = this.getLevel(node);
    if (currentLevel < 1) {
      return null;
    }
    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];
      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  ngOnInit() {
  }

}

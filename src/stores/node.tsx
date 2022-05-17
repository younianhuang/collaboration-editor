export enum NodeType {
  Folder,
  File,
}

export default class Node {
  /// guid of this node
  id: string;

  name: string;

  children: Node[];

  /// guid of this parent node
  parentId: string;

  type: NodeType;

  /*
  constructor() {
    this.children = null;
    this.type = NodeType.File;
  }
*/
  constructor(id: string, name: string, parentId: string) {
    this.id = id;
    this.name = name;
    this.type = NodeType.File;
    this.children = null;
    /*
    if (type === NodeType.Folder) {
      this.children = new Array<Node>();
    } else {
      this.children = null;
    }
*/
    this.parentId = parentId;
  }
}

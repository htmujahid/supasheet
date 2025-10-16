import { TextMatchTransformer } from "@lexical/markdown";

import {
  $createImageNode,
  $isImageNode,
  ImageNode,
} from "@/interfaces/rich-text-editor/nodes/image-node";
import { IMAGE_MAX_WIDTH } from "@/interfaces/rich-text-editor/plugins/images-plugin";

export const IMAGE: TextMatchTransformer = {
  dependencies: [ImageNode],
  export: (node) => {
    if (!$isImageNode(node)) {
      return null;
    }

    return `![${node.getAltText()}](${node.getSrc()})`;
  },
  importRegExp: /!(?:\[([^[]*)\])(?:\(([^(]+)\))/,
  regExp: /!(?:\[([^[]*)\])(?:\(([^(]+)\))$/,
  replace: (textNode, match) => {
    const [, altText, src] = match;
    const imageNode = $createImageNode({
      altText,
      maxWidth: IMAGE_MAX_WIDTH,
      src,
    });
    textNode.replace(imageNode);
  },
  trigger: ")",
  type: "text-match",
};

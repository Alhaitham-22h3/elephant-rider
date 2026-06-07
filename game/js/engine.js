var Engine = (function() {
  var currentNode = null;
  var nodeChangeCallbacks = [];
  var choiceHistory = [];

  function loadNode(nodeId) {
    if (!nodeId) {
      return null;
    }
    var node = StoryData.nodes[nodeId];
    if (!node) {
      return null;
    }
    return JSON.parse(JSON.stringify(node));
  }

  function goToNode(nodeId) {
    var node = loadNode(nodeId);
    if (!node) {
      return false;
    }
    currentNode = node;
    for (var i = 0; i < nodeChangeCallbacks.length; i++) {
      nodeChangeCallbacks[i](currentNode);
    }
    return true;
  }

  function getCurrentNode() {
    return currentNode;
  }

  function onNodeChange(callback) {
    if (typeof callback === 'function') {
      nodeChangeCallbacks.push(callback);
    }
  }

  function makeChoice(optionIndex) {
    if (!currentNode || !currentNode.options || !currentNode.options[optionIndex]) {
      return false;
    }
    var option = currentNode.options[optionIndex];
    choiceHistory.push({
      nodeId: currentNode.id,
      optionIndex: optionIndex,
      optionText: option.text,
      optionType: option.type,
      emotionImpact: option.emotionImpact
    });
    return goToNode(option.nextNodeId);
  }

  function getChoiceHistory() {
    return choiceHistory.slice();
  }

  function start(startNodeId) {
    choiceHistory = [];
    var firstNodeId = startNodeId || 'chapter1_node1';
    return goToNode(firstNodeId);
  }

  return {
    loadNode: loadNode,
    goToNode: goToNode,
    getCurrentNode: getCurrentNode,
    onNodeChange: onNodeChange,
    makeChoice: makeChoice,
    getChoiceHistory: getChoiceHistory,
    start: start
  };
})();

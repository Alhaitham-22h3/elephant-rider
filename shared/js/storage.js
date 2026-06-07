var Storage = (function() {
  var PREFIX = 'elephant_rider_';

  var EMOTION_DATA_FORMAT = {
    type: 'string',
    intensity: 'number',
    timestamp: 'number'
  };

  var SAVE_DATA_FORMAT = {
    nodeId: 'string',
    elephantPower: 'number',
    riderControl: 'number',
    harmony: 'number',
    choiceHistory: 'array',
    timestamp: 'number'
  };

  function save(key, value) {
    try {
      var fullKey = PREFIX + key;
      var data = JSON.stringify(value);
      localStorage.setItem(fullKey, data);
      return true;
    } catch (e) {
      return false;
    }
  }

  function load(key) {
    try {
      var fullKey = PREFIX + key;
      var data = localStorage.getItem(fullKey);
      if (data === null) {
        return null;
      }
      return JSON.parse(data);
    } catch (e) {
      return null;
    }
  }

  function remove(key) {
    try {
      var fullKey = PREFIX + key;
      localStorage.removeItem(fullKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  function clearAll() {
    try {
      var keysToRemove = [];
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (key && key.indexOf(PREFIX) === 0) {
          keysToRemove.push(key);
        }
      }
      for (var j = 0; j < keysToRemove.length; j++) {
        localStorage.removeItem(keysToRemove[j]);
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  function getAllKeys() {
    var keys = [];
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (key && key.indexOf(PREFIX) === 0) {
          keys.push(key.substring(PREFIX.length));
        }
      }
    } catch (e) {}
    return keys;
  }

  function saveEmotion(emotionData) {
    var emotions = load('emotions') || [];
    emotions.push({
      type: emotionData.type,
      intensity: emotionData.intensity,
      timestamp: Date.now()
    });
    return save('emotions', emotions);
  }

  function getEmotions() {
    return load('emotions') || [];
  }

  function saveGame(saveData) {
    var data = {
      nodeId: saveData.nodeId,
      elephantPower: saveData.elephantPower,
      riderControl: saveData.riderControl,
      harmony: saveData.harmony,
      choiceHistory: saveData.choiceHistory || [],
      timestamp: Date.now()
    };
    return save('gameSave', data);
  }

  function loadGame() {
    return load('gameSave');
  }

  return {
    save: save,
    load: load,
    remove: remove,
    clearAll: clearAll,
    getAllKeys: getAllKeys,
    saveEmotion: saveEmotion,
    getEmotions: getEmotions,
    saveGame: saveGame,
    loadGame: loadGame,
    EMOTION_DATA_FORMAT: EMOTION_DATA_FORMAT,
    SAVE_DATA_FORMAT: SAVE_DATA_FORMAT
  };
})();

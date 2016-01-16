module.exports = {
  capitalize: function(aString) {
    // Split into words and capitalize each word, then re-join the strings.
    var wordArray = aString.split(/\s/);
    var extractedWords = new Array();
    for (i in wordArray) {
      var value = wordArray[i];
      if (value.length == 0) {
        continue;
      }
      var newWord = value[0].toUpperCase() + value.substr(1);
      extractedWords.push(newWord);
    }

    return extractedWords.join(" ");
  }
};

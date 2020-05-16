/**
 * @arg input   An input field in the DOM.
 * @arg items   A array of strings, containing valid suggestion items.
 */
function enableSuggestions(button, input, items) {
  var SUGGESTIONS_DIV_CLASS = "suggestions";
  var ACTIVE_DIV_CLASS = "suggestion-active";
  var currentFocus;

  var fuseOptions = {
    keys: ["name"],
    threshold: 0.4
  }
  var fuse = new Fuse(items, fuseOptions);

  // Listen for change to input field.
  input.addEventListener("input", function(_inputEvent) {
    closeAllLists();
    currentFocus = -1;

    var val = this.value;
    if (!val) { return false; }

    // Create div to hold the list of suggestions.
    var suggestionsDiv = document.createElement("div");
    suggestionsDiv.setAttribute("id", this.id + SUGGESTIONS_DIV_CLASS);
    suggestionsDiv.setAttribute("class", SUGGESTIONS_DIV_CLASS);

    this.parentNode.appendChild(suggestionsDiv);

    // Find matching items.
    var matchingItems = fuse.search(val);
    var numResults = Math.min(matchingItems.length, 8);

    // Add suggestion items.
    for (i = 0; i < numResults; i++) {
      suggestionItemDiv = document.createElement("div");
      suggestionItemDiv.innerText = matchingItems[i].item.name;
      
      // Listen for clicks on suggestion item.
      suggestionItemDiv.addEventListener("click", function(clickEvent) {
        input.value = this.innerText;
        closeAllLists();
        button.click();
      });

      suggestionsDiv.appendChild(suggestionItemDiv);
    }

    if (numResults > 0) {
      var suggestionItemsDivArray = suggestionsDiv.getElementsByTagName("div");
      currentFocus = 0;
      addActive(suggestionItemsDivArray);
    }
  });

  // Listen for button presses (UP, DOWN, TAB, ENTER).
  input.addEventListener("keydown", function(keydownEvent) {
    var suggestionsDiv = document.getElementById(this.id + SUGGESTIONS_DIV_CLASS);
    if (suggestionsDiv === null) { return false; }
    
    var suggestionItemsDivArray = suggestionsDiv.getElementsByTagName("div");

    if (keydownEvent.keyCode == 38) {
      // UP keypress
      keydownEvent.preventDefault();
      currentFocus--;
      addActive(suggestionItemsDivArray);
      return;
    }
    
    if (keydownEvent.keyCode == 40 || keydownEvent.keyCode == 9) {
      // DOWN or TAB keypress
      keydownEvent.preventDefault();
      currentFocus++;
      addActive(suggestionItemsDivArray);
      return;
    }
    
    if (keydownEvent.keyCode == 13) {
      // ENTER keypress
      keydownEvent.preventDefault();

      if (currentFocus > -1 && suggestionItemsDivArray) {
        // Simulate click on active suggestion item div.
        suggestionItemsDivArray[currentFocus].click();
        return;
      }

      button.click();
      return;
    }
  });

  button.addEventListener("click", function(clickEvent) {
    clickEvent.preventDefault();
    var url = "/artist/";
    var matchingItems = fuse.search(input.value);
    if (matchingItems.length > 0) {
      url += matchingItems[0].item.url;
    } else {
      url += input.value;
    }
    window.location.href = url;
  });

  // Listen for click events outside of suggestions div.
  document.addEventListener("click", function(clickEvent) {
    closeAllLists(clickEvent.target);
  });


  /* DOM Helper Functions */

  /**
   * @arg suggestionItemsDivArray   An array of divs on the DOM, each
   *                                containing a suggestion item.
   */
  function addActive(suggestionItemsDivArray) {
    clearActive(suggestionItemsDivArray);
    var numItems = suggestionItemsDivArray.length;
    if (currentFocus >= numItems) { currentFocus = 0; }
    if (currentFocus < 0) { currentFocus = (numItems - 1); }
    var activeSuggestionItemDiv = suggestionItemsDivArray[currentFocus];
    activeSuggestionItemDiv.classList.add(ACTIVE_DIV_CLASS);
  }

  /**
   * @arg suggestionItemsDivArray   An array of divs on the DOM, each
   *                                containing a suggestion item.
   */
  function clearActive(suggestionItemsDivArray) {
    for (var i = 0; i < suggestionItemsDivArray.length; i++) {
      suggestionItemsDivArray[i].classList.remove(ACTIVE_DIV_CLASS);
    }
  }

  /**
   * @arg element   A DOM element that will NOT be "closed" if it has the
   *                class `SUGGESTIONS_DIV_CLASS`.
   */
  function closeAllLists(element) {
    var suggestionsDivArray = document.getElementsByClassName(SUGGESTIONS_DIV_CLASS);
    for (var i = 0; i < suggestionsDivArray.length; i++) {
      if (element != suggestionsDivArray[i] && element != input) {
        suggestionsDivArray[i].parentNode.removeChild(suggestionsDivArray[i]);
      }
    }
  }
}

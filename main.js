// @ts-check

/**
 * @typedef InputLine
 * @prop {string} id
 * @prop {"number" | "select"} type
 * @prop {string} label
 * @prop {string} hint
 * @prop {string} value
 * @prop {string=} units
 * 
 * @typedef InputGroup
 * @prop {string} title
 * @prop {InputLine[]} inputs
 * 
 * @typedef {InputGroup[]} InputTree
 */

function setup() {
  /// Load the inputs from the inputs.json file and add them to the DOM
  import("./modules/load-files.js").then((mod) => {
    mod.loadJSON("./inputs.json").then((/** @type {InputTree} */ inputs) => {
      let sidebar = document.getElementById("sidebar");
      if (sidebar === null) {
        throw new Error("Sidebar element is missing");
      }
      for (let i=0; i < inputs.length; i++) {
        let inputGroup = inputs[i];
        // create title on side bar
        let title = document.createElement("div");
        title.className = "input-title";
        title.innerHTML = inputGroup.title;
        sidebar.appendChild(title);
        let content = document.createElement("div");
        content.className = "input-group";
        sidebar.appendChild(content);
        for (let j=0; j < inputGroup.inputs.length; j++) {
          let inputLine = inputGroup.inputs[j];
          // create inputs in the group on the side bar
          let inputLineDiv = document.createElement("div");
          inputLineDiv.className = "input-line";

          let labelDiv = document.createElement("div");
          labelDiv.className = "input-label";
          let label = document.createElement("label");
          label.htmlFor = inputLine.id;
          label.innerHTML = inputLine.label + ":";
          labelDiv.appendChild(label);

          let inputDiv = document.createElement("div");
          inputDiv.className = "input-cell";
          let input = document.createElement("input");
          input.type = inputLine.type;
          input.id = inputLine.id;
          input.title = inputLine.hint;
          input.value = inputLine.value;
          inputDiv.appendChild(input);

          let units = document.createElement("span");
          units.innerHTML = inputLine.units ?? "";
          inputDiv.appendChild(units);

          inputLineDiv.appendChild(labelDiv);
          inputLineDiv.appendChild(inputDiv);

          content.appendChild(inputLineDiv);
        }
      }
    });
  });
}

window.onload = main;
/** The main function. This runs after the entire html page loads.
 *  @returns {void}
*/
function main(){
  setup();
}
